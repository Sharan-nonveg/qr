import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Shield, Sparkles, Sliders, Layout, 
  Download, Globe, Check, Star, ChevronDown, ChevronUp 
} from 'lucide-react';

/* ==========================================================================
   FEATURES SECTION
   ========================================================================== */
export function Features() {
  const featureList = [
    {
      icon: <Zap size={24} />,
      title: 'Generate in < 30 Seconds',
      description: 'Zero technical barriers. Choose your type, paste your data, and click download. It is that fast.'
    },
    {
      icon: <Sliders size={24} />,
      title: 'Advanced Customization',
      description: 'Fully customize colors, gradients, eye styles, and shapes. Brand consistency has never been easier.'
    },
    {
      icon: <Sparkles size={24} />,
      title: 'Brand Integration',
      description: 'Upload your company logo or app icon and embed it directly into the center of the QR code with automatic padding.'
    },
    {
      icon: <Download size={24} />,
      title: 'Vector-Grade Formats',
      description: 'Download in SVG, PNG, JPG, or PDF. Perfect for digital screens, flyers, billboards, or print materials.'
    },
    {
      icon: <Layout size={24} />,
      title: 'CodeMeshFlow CDN Upload',
      description: 'Upload PDFs, menu images, or large files directly to our secure CDN and generate instantly scannable QR links.'
    },
    {
      icon: <Globe size={24} />,
      title: 'Global High Accessibility',
      description: 'Fully optimized QR readability ensures scan compatibility across older and budget devices in all lighting environments.'
    }
  ];

  return (
    <section id="features" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        <h2 className="section-title">
          Everything You Need in a <span className="text-gradient">Premium Engine</span>
        </h2>
        <p className="section-desc">
          Professional tools, pixel-perfect rendering, and blazing-fast delivery for all your QR needs. 100% Free.
        </p>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}
        >
          {featureList.map((feature, i) => (
            <motion.div
              key={i}
              className="glass-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                background: '#111111',
                border: '1px solid var(--border-color)',
                borderRadius: '24px'
              }}
            >
              <div 
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  color: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(0, 229, 255, 0.05)'
                }}
              >
                {feature.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   TESTIMONIALS SECTION
   ========================================================================== */
export function Testimonials() {
  const reviews = [
    {
      name: 'Sarah Jenkins',
      role: 'Restaurant Owner, Crave Bistro',
      text: 'Creating scannable visual menus for our tables was a breeze! The PDF to QR upload makes updates instant, and the custom logo matches our branding perfectly.',
      rating: 5,
      initials: 'SJ',
      glowColor: 'var(--primary-color)'
    },
    {
      name: 'Marcus Chen',
      role: 'Lead Developer, StackFlow',
      text: 'The best tool for QR codes out there. SVG exports are crisp and clean for digital use, and dynamic vCards saved us hours of networking setup.',
      rating: 5,
      initials: 'MC',
      glowColor: 'var(--accent-color)'
    },
    {
      name: 'Elena Rostova',
      role: 'Freelance Designer',
      text: 'I wow my clients with personalized eye dots and elegant color gradients. The UI takes only seconds to master. Clean, fast, and extremely polished.',
      rating: 5,
      initials: 'ER',
      glowColor: 'var(--secondary-color)'
    }
  ];

  return (
    <section id="testimonials" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        <h2 className="section-title">
          Trusted by <span className="text-gradient">Modern Innovators</span>
        </h2>
        <p className="section-desc">
          See how business owners, developers, and designers are elevating their brand experience.
        </p>

        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}
        >
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              className="glass-card"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                padding: '40px 32px',
                background: '#111111',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: `0 15px 30px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 255, 255, 0.01)`
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', color: '#FBBF24' }}>
                  {[...Array(review.rating)].map((_, rIdx) => (
                    <Star key={rIdx} size={16} fill="currentColor" />
                  ))}
                </div>
                <p style={{ color: '#E2E8F0', fontSize: '0.95rem', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '30px' }}>
                  "{review.text}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div 
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${review.glowColor} 0%, rgba(15, 23, 42, 0.8) 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    color: '#fff',
                    fontSize: '0.95rem',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: `0 0 15px ${review.glowColor}40`
                  }}
                >
                  {review.initials}
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '2px' }}>
                    {review.name}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {review.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   FAQ SECTION (ACCORDIONS)
   ========================================================================== */
export function FAQ() {
  const faqItems = [
    {
      q: 'Are the generated QR codes permanent?',
      a: 'Yes, absolutely! The QR codes generated by AntiGravity QR are static and will never expire. They encode the exact text or URL content you input directly. They will continue to work as long as your destination link or data remains active.'
    },
    {
      q: 'Can I upload custom brand logos?',
      a: 'Yes! Under Advanced Customization, you can upload logos in PNG, JPG, or SVG formats. We automatically generate a clean white padding around the logo so it stands out and scans correctly. You can also resize it dynamically using the logo size slider.'
    },
    {
      q: 'How does the PDF/File upload QR type work?',
      a: 'For files like PDFs, you can upload them to our secure CDN powered by CodeMeshFlow. The generator creates a secure CDN link, encodes that link into the QR code, and generates a compact, easily readable code. This service is 100% free with generous file size limits!'
    },
    {
      q: 'What download formats are supported?',
      a: 'We support PNG and JPG for quick digital screens, SVG vectors for professional print designs (where resizing without quality loss is required), and print-ready vector PDF for instant printing.'
    },
    {
      q: 'Is there a scan limit or payment required?',
      a: 'No! There are absolutely no scan limits, watermarks, or payments required. You can generate unlimited QR codes and download them as many times as you need for free.'
    },
    {
      q: 'Can I edit the target URL of a QR code after printing?',
      a: 'Direct static QR codes contain raw data, meaning they cannot be edited once printed. Always verify your inputs using the live preview before printing large batches.'
    }
  ];

  return (
    <section id="faq" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        <h2 className="section-title">
          Frequently Asked <span className="text-gradient">Questions</span>
        </h2>
        <p className="section-desc">
          Find instant answers to common questions about customization, file sizes, and scan limits.
        </p>

        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {faqItems.map((item, index) => (
            <FAQAccordionItem key={index} q={item.q} a={item.a} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQAccordionItem({ q, a, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="glass-card"
      style={{
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        background: '#111111',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          textAlign: 'left',
          color: '#fff',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.05rem',
          fontWeight: 600
        }}
      >
        <span>{q}</span>
        <span style={{ color: isOpen ? 'var(--primary-color)' : 'var(--text-secondary)' }}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              style={{ 
                padding: '0 28px 24px 28px', 
                color: 'var(--text-secondary)', 
                fontSize: '0.9rem', 
                lineHeight: '1.7',
                borderTop: '1px solid rgba(255,255,255,0.02)'
              }}
            >
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
