import Link from 'next/link'
// import ImageFallback from './ImageFallback' // Removed unused import

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Define footer links, grouped by category
  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Demo Login', href: '/login' },
      { name: 'Join Waitlist', href: '/waitlist' },
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Vision', href: '/vision' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' }, // Assuming these pages exist or will exist
      { name: 'Terms of Service', href: '/terms' }, // Assuming these pages exist or will exist
    ],
    pricing: [
      { name: 'Pricing', href: '/pricing' },
    ],
  };

  return (
    <footer className="bg-gray-800 text-gray-400">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Logo and Copyright */}
          <div className="col-span-1 md:col-span-1 mb-6 md:mb-0">
            <Link href="/" className="flex items-center mb-4">
              {/* Minimalist Logo SVG */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <rect width="32" height="32" rx="8" fill="#2563EB"/>
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold text-white">GovBiz Agent</span>
            </Link>
            <p className="text-sm text-gray-400">
              &copy; {currentYear} GovBiz Agent by Xenvya. All rights reserved.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Link */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Pricing</h3>
            <ul className="space-y-3">
              {footerLinks.pricing.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-base text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  )
} 