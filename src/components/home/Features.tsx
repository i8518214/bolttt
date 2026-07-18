const features = [
  {
    title: 'Verified stays',
    description: 'Every listing is reviewed for quality, accuracy, and safety before it goes live.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12.75 11.25 15 15 9.75M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z"
      />
    ),
  },
  {
    title: 'Best price guarantee',
    description: 'Transparent pricing with no hidden fees — find a lower price and we will match it.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6v12m-4-4.5c0 1.38 1.79 2.5 4 2.5s4-1.12 4-2.5-1.79-2.5-4-2.5-4-1.12-4-2.5S9.79 6 12 6s4 1.12 4 2.5"
      />
    ),
  },
  {
    title: '24/7 support',
    description: 'Our support team is available around the clock before, during, and after your trip.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M18.364 5.636a9 9 0 0 1 0 12.728M5.636 5.636a9 9 0 0 0 0 12.728M12 12v.01M12 8v.01M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"
      />
    ),
  },
  {
    title: 'Secure booking',
    description: 'Your payments and personal details are protected end-to-end at every step.',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    ),
  },
]

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Why book with StayFinder</h2>
        <p className="mt-1 text-slate-500">Everything you need for a worry-free trip</p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-slate-200 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {feature.icon}
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
