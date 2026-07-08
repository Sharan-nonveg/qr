import React from 'react';
import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer 
      style={{
        background: '#050505',
        borderTop: '1px solid var(--border-color)',
        padding: '80px 0 40px 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}
          className="footer-grid"
        >
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 2' }} className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div 
                style={{ 
                  background: 'linear-gradient(135deg, #00E5FF 0%, #3B82F6 100%)',
                  borderRadius: '8px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(0, 229, 255, 0.2)'
                }}
              >
                <Cpu size={16} color="#000" />
              </div>
              <span 
                style={{ 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '1.2rem', 
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.5px'
                }}
              >
                AntiGravity<span className="text-gradient" style={{ fontWeight: 800 }}>QR</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px', maxWidth: '320px' }}>
              The premium, professional QR code engine for creators, developers, and brands worldwide. 100% Free.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)' }}>
              Engineered by <a href="https://www.codemeshflow.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>CodeMeshFlow</a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>
              Product
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#generator" style={linkStyle}>QR Generator</a>
              <a href="#features" style={linkStyle}>Advanced Customization</a>
              <a href="#faq" style={linkStyle}>Frequently Asked Questions</a>
            </div>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>
              Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#faq" style={linkStyle}>Help Center</a>
              <a href="https://www.codemeshflow.in" target="_blank" rel="noopener noreferrer" style={linkStyle}>API Terms</a>
              <a href="https://www.codemeshflow.in" target="_blank" rel="noopener noreferrer" style={linkStyle}>Privacy Guidelines</a>
            </div>
          </div>

          {/* Links Col 3 */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="https://www.codemeshflow.in" target="_blank" rel="noopener noreferrer" style={linkStyle}>CodeMeshFlow Official</a>
              <a href="https://www.codemeshflow.in" target="_blank" rel="noopener noreferrer" style={linkStyle}>Design Systems</a>
              <a href="https://www.codemeshflow.in" target="_blank" rel="noopener noreferrer" style={linkStyle}>Partner Program</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-color)', marginBottom: '30px' }}></div>

        {/* Bottom */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}
          className="footer-bottom"
        >
          <span>&copy; {new Date().getFullYear()} AntiGravity QR. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Powered by 
            <a 
              href="https://www.codemeshflow.in" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                letterSpacing: '0.5px',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.target.style.color = '#fff'}
            >
              CodeMeshFlow
            </a>
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-brand-col {
            grid-column: span 1 !important;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

const linkStyle = {
  color: 'var(--text-secondary)',
  textDecoration: 'none',
  fontSize: '0.9rem',
  transition: 'color 0.2s ease',
  alignSelf: 'flex-start'
};
// Add hover behaviors inline
setTimeout(() => {
  document.querySelectorAll('footer a').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (el.style.color !== 'var(--primary-color)' && el.textContent !== 'CodeMeshFlow') {
        el.style.color = 'var(--primary-color)';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (el.textContent !== 'CodeMeshFlow') {
        el.style.color = 'var(--text-secondary)';
      }
    });
  });
}, 50);
