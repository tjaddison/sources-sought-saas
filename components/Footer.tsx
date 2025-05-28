import Link from 'next/link'
// import ImageFallback from './ImageFallback' // Removed unused import

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Define footer links, grouped by category
  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'ROI Calculator', href: '/roi-calculator' },
      { name: 'Pricing', href: '/pricing' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  };

  return (
    <footer className="bg-gray-800 text-gray-400">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8">

          {/* Logo and Copyright - Takes 4 columns on desktop */}
          <div className="col-span-2 md:col-span-6">
            <Link href="/" className="flex items-center mb-5">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                <rect width="32" height="32" rx="8" fill="#2563EB"/>
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold text-white">GovBiz Agent</span>
            </Link>
            <p className="text-sm text-gray-400 mb-5">
              AI-powered federal contracting intelligence that helps you win more contracts with less effort.
            </p>
       
          </div>

          {/* Footer Links - Each takes 2 columns on desktop */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
        
        {/* Bottom section with social links */}
        <div className="pt-8 mt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
          &copy; {currentYear} GovBiz Agent by Xenvya.  All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 