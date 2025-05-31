import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { name: 'About', href: '/about' },
    { name: 'Vision', href: '/vision' },
    { name: 'Features', href: '/features' },
    { name: 'Feedback', href: '/feedback' },
    { name: 'Waitlist', href: '/waitlist' },
    { name: 'Terms', href: '/terms' },
    { name: 'Privacy', href: '/privacy' },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Copyright */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                 <rect width="32" height="32" rx="8" fill="#2563EB"/> {/* Blue-600 */}
                 <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold text-white">GovCon Agent</span>
            </Link>
            <p className="text-sm">
              &copy; {currentYear} GovCon Agent. All rights reserved. <br />
              Empowering federal contractors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.slice(0, 5).map((link) => ( // Show first 5 links
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white hover:underline transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.slice(5).map((link) => ( // Show remaining links
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-white hover:underline transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
               <li>
                 <Link href="/contact" className="hover:text-white hover:underline transition-colors">
                   Contact Us
                 </Link>
               </li>
            </ul>
          </div>

          {/* Optional: Social Media Links */}
          {/* <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white"><svg>...</svg></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white"><svg>...</svg></a>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  )
} 