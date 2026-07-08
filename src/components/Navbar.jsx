import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Removed Pricing Link
  const navLinks = [
    { name: 'Generator', href: '#generator', local: true },
    { name: 'Features', href: '#features', local: true },
    { name: 'FAQ', href: '#faq', local: true },
    { name: 'CodeMeshFlow', href: 'https://www.codemeshflow.in', local: false }
  ];

  const handleLinkClick = (e, link) => {
    if (link.local) {
      e.preventDefault();
      setIsOpen(false);
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(255, 255, 255, 0.02)',
        transition: 'background 0.3s ease, border-bottom 0.3s ease'
      }}
    >
      <div 
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '80px'
        }}
      >
        {/* Logo redirecting to official website */}
        <a 
          href="https://www.codemeshflow.in"
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            textDecoration: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}
        >
          <img 
            src="/logo.png"
            alt="CodeMeshFlow Logo"
            style={{
              height: '50px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
        </a>

        {/* Desktop Nav Links */}
        <div 
          style={{ 
            display: 'none', 
            alignItems: 'center', 
            gap: '32px' 
          }}
          className="desktop-menu-wrapper"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.local ? '_self' : '_blank'}
              rel={link.local ? '' : 'noopener noreferrer'}
              onClick={(e) => handleLinkClick(e, link)}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.95rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.color = '#fff'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#generator"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-gradient"
            style={{
              padding: '12px 24px',
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Create Free QR
          </a>
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
          className="mobile-menu-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: 'hidden',
              background: 'rgba(10, 10, 10, 0.98)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              position: 'absolute',
              width: '100%',
              left: 0,
              top: '80px',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div 
              style={{ 
                padding: '24px 24px 32px 24px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px' 
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.local ? '_self' : '_blank'}
                  rel={link.local ? '' : 'noopener noreferrer'}
                  onClick={(e) => handleLinkClick(e, link)}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
                  }}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="#generator"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                  document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-gradient"
                style={{
                  padding: '14px',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  marginTop: '10px'
                }}
              >
                Create Free QR
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for Responsive Navbar Layout */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-menu-wrapper {
            display: flex !important;
          }
        }
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </motion.nav>
  );
}
