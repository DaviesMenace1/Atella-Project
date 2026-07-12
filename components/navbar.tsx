"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Image 
              src="/images/logo.png" 
              alt="Atella Beach Resort Logo" 
              width={40} 
              height={40} 
              className="rounded-lg"
              priority
            />
            <div>
              <div className="font-serif text-xl font-bold tracking-tight">Attela</div>
              <div className="text-[10px] text-muted-foreground -mt-1">BEACH RESORT</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/experiences" className="hover:text-primary transition-colors">Experiences</Link>
            <Link href="/booking" className="hover:text-primary transition-colors">Book Now</Link>
            <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
            <Link href="/menu" className="hover:text-primary transition-colors">Menu</Link>
            <Link href="/events" className="hover:text-primary transition-colors">Events</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="rounded-full px-6">
              <Link href="/booking">Book Experience</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-6 border-t flex flex-col gap-4 text-sm font-medium">
            <Link href="/experiences" className="py-1" onClick={() => setIsOpen(false)}>Experiences</Link>
            <Link href="/booking" className="py-1" onClick={() => setIsOpen(false)}>Book Now</Link>
            <Link href="/gallery" className="py-1" onClick={() => setIsOpen(false)}>Gallery</Link>
            <Link href="/menu" className="py-1" onClick={() => setIsOpen(false)}>Menu</Link>
            <Link href="/events" className="py-1" onClick={() => setIsOpen(false)}>Events</Link>
            <Link href="/contact" className="py-1" onClick={() => setIsOpen(false)}>Contact</Link>
            
            <div className="pt-4">
              <Button asChild className="w-full rounded-full">
                <Link href="/booking" onClick={() => setIsOpen(false)}>Book Experience</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
