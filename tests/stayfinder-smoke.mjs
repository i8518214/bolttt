import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { chromium } = require('playwright')

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5177'

const checks = []

function record(name, ok, detail = '') {
  checks.push({ name, ok, detail })
  const status = ok ? 'PASS' : 'FAIL'
  console.log(`${status} ${name}${detail ? ` - ${detail}` : ''}`)
}

async function hasNoHorizontalOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement
    return doc.scrollWidth <= doc.clientWidth + 1
  })
}

async function countVisibleText(page, text) {
  return page.getByText(text, { exact: false }).count()
}

async function brokenImages(page) {
  return page.evaluate(() =>
    Array.from(document.images)
      .filter((img) => img.complete && img.naturalWidth === 0)
      .map((img) => img.getAttribute('src') || img.currentSrc),
  )
}

const browser = await chromium.launch({
  headless: true,
  channel: 'chrome',
})

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })
  const consoleErrors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  await page.goto(baseURL, { waitUntil: 'networkidle' })

  record('Home shows StayFinder branding', await countVisibleText(page, 'StayFinder') > 0)
  record('Home uses StayFinder logo', await page.locator('img[alt="StayFinder logo"]').count() > 0)
  record('Home has destination input', await page.getByPlaceholder('Where are you going?').isVisible())
  record('Home has popular destinations', await countVisibleText(page, 'Popular destinations') > 0)
  record('Home has popular apartments', await countVisibleText(page, 'Popular apartments') > 0)
  record('Home has features section', await countVisibleText(page, 'Why book with StayFinder') > 0)
  record('Home has footer contact info', await countVisibleText(page, 'support@stayfinder.com') > 0)
  record('Home images load', (await brokenImages(page)).length === 0)
  record('Desktop has no horizontal overflow', await hasNoHorizontalOverflow(page))

  await page.getByRole('button', { name: 'Search' }).click()
  record(
    'Home search validates required destination',
    await page.getByText('Please enter a destination.').isVisible(),
  )

  await page.getByPlaceholder('Where are you going?').fill('Barcelona')
  await page.locator('input[type="date"]').nth(0).fill('2026-08-10')
  await page.locator('input[type="date"]').nth(1).fill('2026-08-09')
  await page.getByRole('button', { name: 'Search' }).click()
  record(
    'Home search validates date order',
    await page.getByText('Check-out date must be after the check-in date.').isVisible(),
  )

  await page.locator('input[type="date"]').nth(0).fill('2026-07-17')
  await page.locator('input[type="date"]').nth(1).fill('2026-08-13')
  await page.getByRole('button', { name: 'Search' }).click()
  record(
    'Home search rejects past check-in',
    await page.getByText('Check-in date cannot be in the past.').isVisible(),
  )

  await page.locator('input[type="date"]').nth(0).fill('2026-08-10')
  await page.locator('input[type="date"]').nth(1).fill('2026-08-13')
  await page.getByRole('button', { name: 'Search' }).click()
  await page.waitForURL(/\/search/)
  await page.getByText(/properties found|property found/).waitFor()
  record('Search navigation works', page.url().includes('/search?'))
  record('Search results show apartment cards', await page.getByRole('link', { name: /View details/i }).count() > 0)

  await page.goto(`${baseURL}/search?destination=Lisbon&checkin=2026-08-04&checkout=2026-08-06&guests=2`, {
    waitUntil: 'networkidle',
  })
  await page.getByText(/properties found|property found/).waitFor()
  record('Search date filter excludes unavailable stays', !(await page.getByText('Sunlit Alfama Loft').isVisible()))
  record('Search date filter keeps available stays', await page.getByText('Riverside Belém Apartment').isVisible())

  await page.goto(`${baseURL}/search?destination=Barcelona&checkin=2026-08-10&checkout=2026-08-13&guests=2`, {
    waitUntil: 'networkidle',
  })
  await page.getByText(/properties found|property found/).waitFor()
  await page.getByPlaceholder('Min').fill('300')
  await page.getByPlaceholder('Max').fill('350')
  await page.getByText(/properties found|property found/).waitFor()
  record('Price filter can produce empty state', await page.getByText('No apartments match your search').isVisible())

  await page.getByRole('button', { name: 'Clear search and filters' }).click()
  await page.getByText(/properties found|property found/).waitFor()
  record('Clear search resets destination field', (await page.getByPlaceholder('Where are you going?').inputValue()) === '')
  record('Clear search resets date fields', await page.locator('input[type="date"]').evaluateAll((inputs) =>
    inputs.every((input) => input.value === ''),
  ))
  await page.getByRole('link', { name: /View details/i }).first().click()
  await page.waitForURL(/\/apartments\//)
  await page.getByRole('button', { name: 'Book now' }).waitFor()
  record('Detail page shows gallery images', await page.locator('main img').count() >= 3)
  record('Detail page images load', (await brokenImages(page)).length === 0)
  record('Detail page shows amenities', await page.getByText('Amenities').isVisible())
  record('Detail page shows reviews', await page.getByRole('heading', { name: 'Reviews' }).isVisible())
  record('Detail page shows booking form', await page.getByRole('button', { name: 'Book now' }).isVisible())

  await page.getByRole('button', { name: 'Book now' }).click()
  record('Booking validates full name', await page.getByText('Full name is required.').isVisible())
  record('Booking validates email', await page.getByText('Email is required.').isVisible())
  record('Booking validates check-in', await page.getByText('Check-in date is required.').isVisible())

  await page.getByLabel('Full name').fill('Test Guest')
  await page.getByLabel('Email').fill('test@example.com')
  await page.locator('input[type="date"]').nth(0).fill('2026-07-17')
  await page.locator('input[type="date"]').nth(1).fill('2026-08-23')
  await page.getByRole('button', { name: 'Book now' }).click()
  record(
    'Booking rejects past check-in',
    await page.getByText('Check-in date cannot be in the past.').isVisible(),
  )

  await page.goto(`${baseURL}/apartments/lisbon-alfama-loft`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Book now' }).waitFor()
  await page.getByLabel('Full name').fill('Overlap Guest')
  await page.getByLabel('Email').fill('overlap@example.com')
  await page.locator('input[type="date"]').nth(0).fill('2026-08-04')
  await page.locator('input[type="date"]').nth(1).fill('2026-08-06')
  await page.getByRole('button', { name: 'Book now' }).click()
  record(
    'Booking rejects unavailable dates',
    await page.getByText('These dates are already booked. Please choose different dates.').isVisible(),
  )

  await page.getByLabel('Full name').fill('Test Guest')
  await page.getByLabel('Email').fill('test@example.com')
  await page.locator('input[type="date"]').nth(0).fill('2026-08-20')
  await page.locator('input[type="date"]').nth(1).fill('2026-08-23')
  await page.getByRole('button', { name: 'Book now' }).click()
  await page.waitForURL(/\/booking-confirmation\//)
  record('Booking confirmation route opens', page.url().includes('/booking-confirmation/'))
  record('Confirmation shows success message', await page.getByText('Booking confirmed!').isVisible())
  record('Confirmation shows guest info', await page.getByText('Test Guest').isVisible())
  record('Confirmation shows booking number', await page.getByText(/SF-\d{6}/).isVisible())

  await page.goto(`${baseURL}/admin`, { waitUntil: 'networkidle' })
  record('Unauthenticated /admin redirects to login', page.url().includes('/admin/login'))
  await page.getByRole('button', { name: 'Sign in' }).click()
  record('Admin login validates empty email', await page.getByText('Email is required.').isVisible())
  await page.getByLabel('Email').fill('admin@mail.com')
  await page.getByLabel('Password').fill('bad-password')
  await page.getByRole('button', { name: 'Sign in' }).click()
  record('Admin login rejects invalid credentials', await page.getByText('Invalid email or password.').isVisible())
  await page.getByLabel('Password').fill('Pa55word')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL(/\/admin$/)
  record('Admin login redirects to dashboard', page.url().endsWith('/admin'))
  record('Admin table has booking columns', await page.getByRole('columnheader', { name: 'Booking #' }).isVisible())
  record('Admin shows newly created booking', await page.getByText('Test Guest').isVisible())
  await page.getByLabel('Search').fill('Test Guest')
  record('Admin search by guest works', await page.getByText('Test Guest').isVisible())
  await page.getByLabel(/Change status for booking SF-/).selectOption('cancelled')
  const testGuestRow = page.getByRole('row', { name: /Test Guest/ })
  record('Admin can change booking status', await testGuestRow.locator('span').filter({ hasText: 'Cancelled' }).isVisible())
  const statusFilter = page.locator('label').filter({ hasText: 'Status' }).locator('select').first()
  await statusFilter.selectOption('cancelled')
  record('Admin status filter shows updated booking', await page.getByText('Test Guest').isVisible())
  await statusFilter.selectOption('confirmed')
  record('Admin status filter empty state works', await page.getByText('No bookings found').isVisible())
  await statusFilter.selectOption('all')
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Delete' }).click()
  record('Admin can delete booking', await page.getByText('No bookings found').isVisible())
  record('No browser console errors during main flow', consoleErrors.length === 0, consoleErrors.slice(0, 2).join(' | '))

  const mobile = await browser.newPage({ viewport: { width: 390, height: 900 } })
  await mobile.goto(baseURL, { waitUntil: 'networkidle' })
  record('Mobile home has no horizontal overflow', await hasNoHorizontalOverflow(mobile))
  record('Mobile nav toggle is visible', await mobile.getByLabel('Toggle navigation menu').isVisible())
  await mobile.getByLabel('Toggle navigation menu').click()
  record('Mobile menu exposes search link', await mobile.getByRole('link', { name: 'Search', exact: true }).isVisible())
  await mobile.goto(`${baseURL}/search`, { waitUntil: 'networkidle' })
  await mobile.getByText(/properties found|property found/).waitFor()
  record('Mobile search has no horizontal overflow', await hasNoHorizontalOverflow(mobile))
  await mobile.goto(`${baseURL}/apartments/lisbon-alfama-loft`, { waitUntil: 'networkidle' })
  await mobile.getByRole('button', { name: 'Book now' }).waitFor()
  record('Mobile detail has no horizontal overflow', await hasNoHorizontalOverflow(mobile))
  await mobile.goto(`${baseURL}/admin/login`, { waitUntil: 'networkidle' })
  record('Mobile admin login has no horizontal overflow', await hasNoHorizontalOverflow(mobile))
  await mobile.getByLabel('Email').fill('admin@mail.com')
  await mobile.getByLabel('Password').fill('Pa55word')
  await mobile.getByRole('button', { name: 'Sign in' }).click()
  await mobile.waitForURL(/\/admin$/)
  record('Mobile admin dashboard has no page overflow', await hasNoHorizontalOverflow(mobile))

  const failed = checks.filter((check) => !check.ok)
  console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`)
  if (failed.length > 0) process.exitCode = 1
} finally {
  await browser.close()
}
