export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4 mb-8">
          {/* CASEC Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] mb-4">CASEC</h3>
            <p className="text-xs leading-6 text-stone-400">
              Career Services Centre, University, Nigeria – empowering students to discover and achieve their professional aspirations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] mb-4">Quick Link</h3>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms & Condition
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQs & Help
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] mb-4">Contact</h3>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Ede, Osun State</li>
              <li>+234 (0)703</li>
              <li>
                <a href="mailto:info@utrust.com.ng" className="hover:text-white transition">
                  info@utrust.com.ng
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] mb-4">Newsletter</h3>
            <p className="text-xs text-stone-400 mb-3">Let's hear from you.</p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="text-xs rounded border border-stone-700 bg-stone-800 px-3 py-2 text-white outline-none transition focus:border-[#097969]"
              />
              <button className="text-xs rounded bg-[#097969] px-3 py-2 font-semibold text-white hover:bg-[#065f52] transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Career Services Centre, University, Nigeria. All Rights Reserved.</p>
          <p>Designed by CASEC team</p>
        </div>
      </div>
    </footer>
  );
}

