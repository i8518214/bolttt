import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-navy-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src="/stayfinder-logo.svg" alt="StayFinder logo" className="h-9 w-auto" />
              <span className="text-lg font-bold text-white">StayFinder</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-400">
              Find and book unique apartments, villas, and homes around the world.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-white">Search apartments</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white">Admin dashboard</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><span className="hover:text-white">About us</span></li>
              <li><span className="hover:text-white">Careers</span></li>
              <li><span className="hover:text-white">Help center</span></li>
              <li><span className="hover:text-white">Terms &amp; privacy</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>support@stayfinder.com</li>
              <li>+1 (555) 010-2024</li>
              <li>123 Market Street, San Francisco, CA</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-800 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} StayFinder. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
