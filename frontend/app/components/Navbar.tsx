"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Crosshair, Globe, MessageSquare, Sparkles } from "lucide-react";

const navItems = [
  { href: "/capture", label: "Capture", icon: Crosshair },
  { href: "/search", label: "Search", icon: Globe },
  { href: "/explore", label: "Explore", icon: Sparkles },
  { href: "/ask", label: "Ask", icon: MessageSquare },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand */}
        <Link href="/" className="navbar-brand" aria-label="nibame home">
          <div className="navbar-logo" aria-hidden="true">
            <Brain size={16} />
          </div>
          <div>
            <div className="navbar-name">nibame</div>
            <div className="navbar-tagline">にばめ · second</div>
          </div>
        </Link>

        {/* Nav links */}
        <ul className="navbar-nav" role="list">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`navbar-link${isActive ? " active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={14} aria-hidden="true" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <Link href="/capture" className="btn btn-primary btn-sm" id="navbar-cta">
          <Crosshair size={13} aria-hidden="true" />
          Capture
        </Link>
      </div>
    </nav>
  );
}
