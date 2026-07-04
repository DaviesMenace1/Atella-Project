import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-foreground text-white/80 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white font-serif text-xl font-bold">A</span>
              </div>
              <div className="font-serif text-2xl font-bold text-white tracking-tight">Attela Beach Resort</div>
            </div>
            <p className="max-w-md text-white/70 leading-relaxed">
              A vibrant lakeside destination on Lake Victoria, Kisumu — where sunsets, 
              great food, music, and unforgettable experiences come together.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-wider text-sm">EXPLORE</div>
            <div className="space-y-2 text-sm">
              <Link href="/experiences" className="block hover:text-white transition-colors">Experiences</Link>
              <Link href="/booking" className="block hover:text-white transition-colors">Book Now</Link>
              <Link href="/gallery" className="block hover:text-white transition-colors">Gallery</Link>
              <Link href="/menu" className="block hover:text-white transition-colors">Menu &amp; Pricing</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="font-semibold text-white mb-4 tracking-wider text-sm">CONTACT</div>
            <div className="space-y-2 text-sm">
              <a href="tel:+254799096255" className="block hover:text-white transition-colors">+254 799 096255</a>
              <a href="tel:+254714049037" className="block hover:text-white transition-colors">+254 714 049037</a>
              <a href="https://wa.me/254799096255" className="block hover:text-white transition-colors">WhatsApp Us</a>
              <Link href="/contact" className="block hover:text-white transition-colors">Visit Us</Link>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-white/60 gap-4">
          <div>© {new Date().getFullYear()} Attela Beach Resort. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/attela_beach_resort" target="_blank" className="hover:text-white">Instagram</a>
            <a href="https://www.facebook.com/AttelaBeachResort" target="_blank" className="hover:text-white">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
