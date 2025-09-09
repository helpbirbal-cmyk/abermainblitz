// components/Footer.tsx
export default function Footer() {
  const footerLinks = {
    solutions: [
      { label: "Banking & Financial Services", href: "#" },
      { label: "OTT & Streaming Services", href: "#" },
      { label: "Media Companies", href: "#" }
    ],
    resources: [
      { label: "Case Studies", href: "#" },
      { label: "White Papers", href: "#" },
      { label: "Webinars", href: "#" },
      { label: "Blog", href: "#" }
    ]
  }

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ABERDEEN</h3>
            <p className="text-gray-400">MozarkAI for BFSI & OTT</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Industry Solutions</h4>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>aberdeenassociates@aol.com</li>
              <li>+1 (555) 123-4567</li>
              <li>India | USA | Middle East | Singapore</li>
            </ul>
          </div>
        </div>
        <hr className="border-gray-700 my-8" />
        <div className="text-center text-gray-400">
          <p>© 2025 Aberdeen. All rights reserved. | MozarkAI </p>
        </div>
      </div>
    </footer>
  )
}
