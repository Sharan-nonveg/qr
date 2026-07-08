import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, MessageSquare, Wifi, FileText, AlignLeft, User, Sparkles
} from 'lucide-react';
import QRForm from './QRForm';
import QRPreview from './QRPreview';

export default function Dashboard() {
  const [selectedType, setSelectedType] = useState('website');
  
  // Single state storage for active form parameters
  const [formData, setFormData] = useState({
    websiteUrl: '',
    whatsappCode: '+1',
    whatsappPhone: '',
    whatsappMessage: '',
    wifiSsid: '',
    wifiPassword: '',
    wifiSecurity: 'WPA',
    wifiHidden: false,
    pdfCdnUrl: '',
    pdfFileName: '',
    textContent: '',
    vcardFirstName: '',
    vcardLastName: '',
    vcardPhone: '',
    vcardEmail: '',
    vcardOrg: '',
    vcardTitle: '',
    vcardUrl: '',
    vcardAddress: ''
  });

  const [errors, setErrors] = useState({});
  const [qrValue, setQrValue] = useState('');

  // 6 QR Types config (Removed 5 types: Google Review, Phone, Email, Location, UPI)
  const qrTypes = [
    { id: 'website', name: 'Website', desc: 'Link to any site or URL', icon: <Globe size={22} /> },
    { id: 'whatsapp', name: 'WhatsApp', desc: 'Direct chat with message', icon: <MessageSquare size={22} /> },
    { id: 'wifi', name: 'WiFi Network', desc: 'Connect without password', icon: <Wifi size={22} /> },
    { id: 'pdf', name: 'PDF Document', desc: 'CDN hosted PDF viewer', icon: <FileText size={22} /> },
    { id: 'text', name: 'Plain Text', desc: 'Display text messages', icon: <AlignLeft size={22} /> },
    { id: 'vcard', name: 'vCard Contact', desc: 'Download contact card', icon: <User size={22} /> }
  ];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setErrors({});
    setQrValue('');
  };

  return (
    <section id="generator" style={{ padding: '60px 0 100px 0', position: 'relative' }}>
      {/* Visual background elements */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'rgba(0, 229, 255, 0.03)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: 'rgba(124, 58, 237, 0.02)',
          borderRadius: '50%',
          filter: 'blur(110px)',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />

      <div className="container">
        
        {/* Intro */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span 
            style={{
              background: 'rgba(0, 229, 255, 0.06)',
              border: '1px solid rgba(0, 229, 255, 0.15)',
              color: 'var(--primary-color)',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px'
            }}
          >
            <Sparkles size={12} /> 100% Free QR Code Engine
          </span>
          <h1 
            style={{ 
              fontFamily: 'var(--font-heading)',
              fontSize: '3rem',
              fontWeight: 800,
              color: '#fff',
              marginBottom: '16px',
              letterSpacing: '-1px'
            }}
          >
            AntiGravity <span className="text-gradient">QR Generator</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Create customized, high-resolution QR codes in under 30 seconds. No payments, no limits, no registration.
          </p>
        </div>

        {/* Step 1: QR Type Card Selector Grid */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div 
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              1
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
              Select QR Type
            </h3>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '20px'
            }}
          >
            {qrTypes.map((type) => (
              <motion.div
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`type-card ${selectedType === type.id ? 'active' : ''}`}
              >
                <div className="type-card-icon">
                  {type.icon}
                </div>
                <h4 className="type-card-title">{type.name}</h4>
                <p className="type-card-desc">{type.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Steps 2-5: Form & Preview Layout Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            alignItems: 'start'
          }}
          className="generator-workspace"
        >
          {/* Form Side */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '40px', 
              background: '#111111',
              borderRadius: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                2
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                Fill in <span className="text-gradient">{qrTypes.find(t => t.id === selectedType)?.name}</span> Details
              </h3>
            </div>

            {/* Input fields sub component */}
            <QRForm 
              selectedType={selectedType}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              setQrValue={setQrValue}
            />
            
            <div 
              style={{ 
                marginTop: '40px', 
                padding: '20px', 
                background: 'rgba(255,255,255,0.01)', 
                borderRadius: '14px', 
                border: '1px solid rgba(255,255,255,0.04)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span>Need help? Check our guides.</span>
              <a 
                href="#faq" 
                style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 600 }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('faq').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View FAQ
              </a>
            </div>
          </div>

          {/* Preview Side */}
          <div 
            className="glass-card" 
            style={{ 
              padding: '40px', 
              background: '#111111', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              borderRadius: '24px'
            }}
          >
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'var(--primary-gradient)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                3
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                Preview & Export
              </h3>
            </div>

            {/* Preview component */}
            <QRPreview qrValue={qrValue} />
            
            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.25)', marginTop: '24px', letterSpacing: '0.5px' }}>
              POWERED BY <a href="https://www.codemeshflow.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>CodeMeshFlow</a>
            </span>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 991px) {
          .generator-workspace {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
        @media (max-width: 768px) {
          h1 {
            font-size: 2.2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
