import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Copy, Share2, Sliders, Check, 
  Trash2, Upload, ChevronDown, ChevronUp, RefreshCw,
  Mail, MessageSquare, X, Send
} from 'lucide-react';

export default function QRPreview({ qrValue }) {
  const containerRef = useRef(null);
  const qrCodeRef = useRef(null);
  const fileInputRef = useRef(null);

  // Success and Copy states
  const [showSuccessGlow, setShowSuccessGlow] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Customization expanded state
  const [isCustomExpanded, setIsCustomExpanded] = useState(false);
  
  // Customizer Settings (Updated defaults for pure black theme #111111 card background)
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(15);
  const [errorCorrection, setErrorCorrection] = useState('H');
  const [dotsStyle, setDotsStyle] = useState('rounded');
  const [dotsColor, setDotsColor] = useState('#00E5FF');
  const [useGradient, setUseGradient] = useState(true);
  const [dotsGradientColor, setDotsGradientColor] = useState('#3B82F6');
  const [bgColor, setBgColor] = useState('#111111');
  const [isTransparentBg, setIsTransparentBg] = useState(false);
  const [eyeFrameStyle, setEyeFrameStyle] = useState('rounded');
  const [eyeFrameColor, setEyeFrameColor] = useState('#3B82F6');
  const [eyeBallStyle, setEyeBallStyle] = useState('dot');
  const [eyeBallColor, setEyeBallColor] = useState('#00E5FF');
  
  // Logo Upload states
  const [rawLogo, setRawLogo] = useState(''); // stores the uploaded raw base64
  const [logoImage, setLogoImage] = useState(''); // stores processed base64 with white padding
  const [logoName, setLogoName] = useState('');
  const [logoSize, setLogoSize] = useState(0.3); // ranges from 0.1 to 0.5

  // Helper to draw white rounded rectangle padding behind any logo (PNG, SVG, JPG)
  const applyWhitePadding = (srcDataUrl, sizeRatio = 0.75) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const canvasSize = 300;
        canvas.width = canvasSize;
        canvas.height = canvasSize;
        
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        
        // Draw white rounded background padding container
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        const radius = 50; // corner radius
        ctx.roundRect(0, 0, canvasSize, canvasSize, radius);
        ctx.fill();
        
        // Render logo centered inside padding
        const innerSize = canvasSize * sizeRatio;
        const offset = (canvasSize - innerSize) / 2;
        ctx.drawImage(img, offset, offset, innerSize, innerSize);
        
        resolve(canvas.toDataURL());
      };
      img.src = srcDataUrl;
    });
  };

  // Initial setup of QR Code instance
  useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: 300,
      height: 300,
      type: 'svg',
      data: qrValue || 'https://www.codemeshflow.in',
      margin: margin,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: errorCorrection
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: logoSize,
        margin: 5,
        crossOrigin: 'anonymous'
      },
      dotsOptions: {
        type: dotsStyle,
        color: dotsColor,
        gradient: useGradient ? {
          type: 'linear',
          rotation: 45,
          colorStops: [
            { offset: 0, color: dotsColor },
            { offset: 1, color: dotsGradientColor }
          ]
        } : null
      },
      backgroundOptions: {
        color: isTransparentBg ? 'transparent' : bgColor
      },
      cornersSquareOptions: {
        type: eyeFrameStyle,
        color: eyeFrameColor
      },
      cornersDotOptions: {
        type: eyeBallStyle,
        color: eyeBallColor
      }
    });

    if (containerRef.current) {
      qrCodeRef.current.append(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  // Update QR Code options when customization parameters, logo, or value changes
  useEffect(() => {
    if (!qrCodeRef.current) return;

    if (qrValue) {
      setShowSuccessGlow(true);
      const timer = setTimeout(() => setShowSuccessGlow(false), 1200);
      
      qrCodeRef.current.update({
        data: qrValue,
        width: 300,
        height: 300,
        margin: margin,
        qrOptions: {
          errorCorrectionLevel: errorCorrection
        },
        image: logoImage || null,
        imageOptions: {
          imageSize: logoSize,
          hideBackgroundDots: true
        },
        dotsOptions: {
          type: dotsStyle,
          color: dotsColor,
          gradient: useGradient ? {
            type: 'linear',
            rotation: 45,
            colorStops: [
              { offset: 0, color: dotsColor },
              { offset: 1, color: dotsGradientColor }
            ]
          } : null
        },
        backgroundOptions: {
          color: isTransparentBg ? 'transparent' : bgColor
        },
        cornersSquareOptions: {
          type: eyeFrameStyle,
          color: eyeFrameColor
        },
        cornersDotOptions: {
          type: eyeBallStyle,
          color: eyeBallColor
        }
      });
      return () => clearTimeout(timer);
    } else {
      qrCodeRef.current.update({
        data: 'https://www.codemeshflow.in',
        image: logoImage || null,
        imageOptions: {
          imageSize: logoSize,
          hideBackgroundDots: true
        }
      });
    }
  }, [
    qrValue, size, margin, errorCorrection, dotsStyle, dotsColor, 
    useGradient, dotsGradientColor, bgColor, isTransparentBg, 
    eyeFrameStyle, eyeFrameColor, eyeBallStyle, eyeBallColor, logoImage, logoSize
  ]);

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target.result;
      setRawLogo(base64);
      // Process automatically to draw white circular/rounded rectangle background
      const processed = await applyWhitePadding(base64, 0.72);
      setLogoImage(processed);
      setLogoName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setRawLogo('');
    setLogoImage('');
    setLogoName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download actions
  const handleDownload = (format) => {
    if (!qrCodeRef.current) return;
    
    qrCodeRef.current.update({
      width: size,
      height: size
    });

    setTimeout(() => {
      if (format === 'pdf') {
        downloadAsPdf();
      } else {
        qrCodeRef.current.download({
          name: 'codemeshflow-qr-code',
          extension: format
        });
      }
      
      setTimeout(() => {
        qrCodeRef.current.update({
          width: 300,
          height: 300
        });
      }, 500);
    }, 100);
  };

  // Download PDF layout using jsPDF
  const downloadAsPdf = () => {
    const canvas = containerRef.current.querySelector('canvas');
    if (!canvas) return;

    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Pure black premium print card layout
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 297, 'F');

    // Accent header lines
    doc.setFillColor(0, 229, 255);
    doc.rect(0, 0, 210, 4, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(255, 255, 255);
    doc.text("AntiGravity QR Code", 105, 35, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(161, 161, 170); // Secondary text #A1A1AA
    doc.text("Generated securely via CodeMeshFlow.in", 105, 45, { align: "center" });

    // Inner QR container border
    doc.setDrawColor(255, 255, 255, 0.08);
    doc.setFillColor(17, 17, 17); // Cards background #111111
    doc.roundedRect(45, 60, 120, 120, 10, 10, 'FD');

    // Draw the image
    doc.addImage(imgData, 'PNG', 50, 65, 110, 110);

    // Footer info
    doc.setFontSize(10);
    doc.setTextColor(161, 161, 170);
    doc.text("Scan this code to load destination details instantly.", 105, 205, { align: "center" });
    
    doc.setFontSize(8);
    doc.setTextColor(0, 229, 255);
    doc.text("POWERED BY CODEMESHFLOW.IN", 105, 270, { align: "center" });

    doc.save('antigravity-qr-code.pdf');
  };

  // Copy encoded value to clipboard
  const handleCopyLink = () => {
    if (!qrValue) return;
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}>
      
      {/* QR Code Preview Frame */}
      <div style={{ position: 'relative' }}>
        {/* Glow Success Ring */}
        <AnimatePresence>
          {showSuccessGlow && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1.15, opacity: 1 }}
              exit={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '-15px',
                left: '-15px',
                right: '-15px',
                bottom: '-15px',
                borderRadius: '32px',
                border: '3px solid var(--primary-color)',
                boxShadow: '0 0 40px rgba(0, 229, 255, 0.6), inset 0 0 20px rgba(0, 229, 255, 0.3)',
                pointerEvents: 'none'
              }}
            />
          )}
        </AnimatePresence>

        {/* The Card Housing the Canvas */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '24px', 
            borderRadius: '28px',
            background: '#050505',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: qrValue ? '0 30px 70px rgba(0, 229, 255, 0.25)' : 'none',
            border: qrValue ? '2px solid rgba(0, 229, 255, 0.4)' : '1px solid var(--border-color)',
            transition: 'all 0.5s ease',
            width: '348px',
            height: '348px'
          }}
        >
          <div 
            ref={containerRef} 
            style={{ 
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />

          {!qrValue && (
            <div 
              style={{ 
                position: 'absolute', 
                background: 'rgba(5, 5, 5, 0.92)', 
                backdropFilter: 'blur(4px)',
                width: '100%',
                height: '100%',
                borderRadius: '26px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                textAlign: 'center',
                gap: '12px'
              }}
            >
              <RefreshCw size={24} className="pulse-active" style={{ color: 'var(--primary-color)', animation: 'spin 3s linear infinite' }} />
              <h4 style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600 }}>
                Awaiting Inputs
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '200px' }}>
                Fill out the form fields above to compile your free QR.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Success Hint */}
      {qrValue && (
        <span style={{ fontSize: '0.85rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}>
          <Check size={16} /> QR Live Preview & Sync Active
        </span>
      )}

      {/* Advanced Customization (Accordion) */}
      <div style={{ width: '100%' }}>
        <button
          onClick={() => setIsCustomExpanded(!isCustomExpanded)}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid var(--border-color)',
            padding: '16px 20px',
            borderRadius: '14px',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'border-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={18} color="var(--primary-color)" /> Advanced Customizer
          </span>
          {isCustomExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        <AnimatePresence>
          {isCustomExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div 
                style={{
                  background: '#111111',
                  border: '1px solid var(--border-color)',
                  borderTop: 'none',
                  borderBottomLeftRadius: '14px',
                  borderBottomRightRadius: '14px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                {/* 1. Logo Branding (Dynamic Custom Logo Controls with Auto White Padding) */}
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '0.9rem', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    Center Branding Logo
                  </h4>
                  {!logoImage ? (
                    <div>
                      <button
                        onClick={() => fileInputRef.current.click()}
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px dashed var(--border-color)',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem',
                          width: '100%',
                          justifyContent: 'center'
                        }}
                      >
                        <Upload size={16} /> Upload Logo (PNG, JPG, SVG)
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        accept="image/png, image/jpeg, image/svg+xml" 
                        style={{ display: 'none' }}
                        onChange={handleLogoUpload}
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          background: 'rgba(255, 255, 255, 0.02)', 
                          padding: '10px 14px', 
                          borderRadius: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                          {logoName}
                        </span>
                        <button
                          onClick={removeLogo}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      {/* Logo Size Slider */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          <span>Logo Size (Ratio)</span>
                          <span style={{ color: 'var(--primary-color)' }}>{Math.round(logoSize * 100)}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0.1" 
                          max="0.45" 
                          step="0.05"
                          value={logoSize}
                          onChange={(e) => setLogoSize(Number(e.target.value))}
                          style={{ width: '100%', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '4px', display: 'block' }}>
                          ✓ White background auto-padded for optimal scanner contrast
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Shapes Settings */}
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '0.9rem', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    Shape & Design
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Dots Style</label>
                      <select 
                        className="input-field" 
                        style={{ padding: '10px', fontSize: '0.85rem' }}
                        value={dotsStyle}
                        onChange={(e) => setDotsStyle(e.target.value)}
                      >
                        <option value="rounded">Rounded</option>
                        <option value="dots">Circular Dots</option>
                        <option value="classy">Classy Curves</option>
                        <option value="classy-rounded">Classy Rounded</option>
                        <option value="square">Classic Square</option>
                        <option value="extra-rounded">Extra Rounded</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Error Correction</label>
                      <select 
                        className="input-field" 
                        style={{ padding: '10px', fontSize: '0.85rem' }}
                        value={errorCorrection}
                        onChange={(e) => setErrorCorrection(e.target.value)}
                      >
                        <option value="L">L (7% Recovery)</option>
                        <option value="M">M (15% Recovery)</option>
                        <option value="Q">Q (25% Recovery)</option>
                        <option value="H">H (30% Recovery - Recommended for Logo)</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Eye Corner (Frame)</label>
                      <select 
                        className="input-field" 
                        style={{ padding: '10px', fontSize: '0.85rem' }}
                        value={eyeFrameStyle}
                        onChange={(e) => setEyeFrameStyle(e.target.value)}
                      >
                        <option value="rounded">Rounded Square</option>
                        <option value="square">Sharp Square</option>
                        <option value="dot">Circle</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Eye Ball (Inner Dot)</label>
                      <select 
                        className="input-field" 
                        style={{ padding: '10px', fontSize: '0.85rem' }}
                        value={eyeBallStyle}
                        onChange={(e) => setEyeBallStyle(e.target.value)}
                      >
                        <option value="dot">Circle</option>
                        <option value="square">Square</option>
                        <option value="rounded">Rounded</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Color Settings */}
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '0.9rem', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    Color Palette
                  </h4>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <input 
                        type="checkbox" 
                        checked={useGradient} 
                        onChange={(e) => setUseGradient(e.target.checked)} 
                        style={{ accentColor: 'var(--primary-color)', width: '16px', height: '16px' }}
                      />
                      Enable QR Gradient
                    </label>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        {useGradient ? 'Gradient Start' : 'QR Code Color'}
                      </label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input 
                          type="color" 
                          value={dotsColor}
                          onChange={(e) => setDotsColor(e.target.value)}
                          style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'monospace' }}>{dotsColor.toUpperCase()}</span>
                      </div>
                    </div>
                    {useGradient && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Gradient End</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input 
                            type="color" 
                            value={dotsGradientColor}
                            onChange={(e) => setDotsGradientColor(e.target.value)}
                            style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'monospace' }}>{dotsGradientColor.toUpperCase()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Eye Colors */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Eye Corner Color</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input 
                          type="color" 
                          value={eyeFrameColor} 
                          onChange={(e) => setEyeFrameColor(e.target.value)} 
                          style={{ width: '30px', height: '30px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'monospace' }}>{eyeFrameColor.toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Eye Ball Color</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input 
                          type="color" 
                          value={eyeBallColor} 
                          onChange={(e) => setEyeBallColor(e.target.value)} 
                          style={{ width: '30px', height: '30px', padding: 0, border: 'none', cursor: 'pointer', background: 'transparent' }}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'monospace' }}>{eyeBallColor.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Background Color */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <input 
                          type="checkbox" 
                          checked={isTransparentBg} 
                          onChange={(e) => setIsTransparentBg(e.target.checked)} 
                          style={{ accentColor: 'var(--primary-color)', width: '16px', height: '16px' }}
                        />
                        Transparent Background
                      </label>
                    </div>
                    {!isTransparentBg && (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input 
                          type="color" 
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                          style={{ width: '40px', height: '40px', padding: '0', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'monospace' }}>{bgColor.toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Sizing & Padding */}
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '0.9rem', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                    Dimensions & Margins
                  </h4>
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <span>Download QR Size</span>
                      <span style={{ color: '#fff' }}>{size}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="300" 
                      max="1000" 
                      step="50"
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      <span>Border Margin</span>
                      <span style={{ color: '#fff' }}>{margin}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="60" 
                      step="5"
                      value={margin}
                      onChange={(e) => setMargin(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--primary-color)', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons: Download Grid */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h4 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '0.95rem', fontWeight: 600, alignSelf: 'flex-start' }}>
          Download Asset (100% Free)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button 
            disabled={!qrValue}
            onClick={() => handleDownload('png')}
            className={qrValue ? 'btn-gradient' : ''}
            style={{
              padding: '14px',
              borderRadius: '12px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: qrValue ? 'pointer' : 'not-allowed',
              opacity: qrValue ? 1 : 0.4,
              border: 'none',
              background: qrValue ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.05)',
              color: qrValue ? '#000' : 'var(--text-secondary)'
            }}
          >
            <Download size={16} /> PNG (Web)
          </button>
          <button 
            disabled={!qrValue}
            onClick={() => handleDownload('svg')}
            style={{
              padding: '14px',
              borderRadius: '12px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: qrValue ? 'pointer' : 'not-allowed',
              opacity: qrValue ? 1 : 0.4,
              border: '1px solid var(--border-color)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: '#fff',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => { if (qrValue) e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.02)'; }}
          >
            <Download size={16} /> SVG (Vector)
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button 
            disabled={!qrValue}
            onClick={() => handleDownload('pdf')}
            style={{
              padding: '14px',
              borderRadius: '12px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: qrValue ? 'pointer' : 'not-allowed',
              opacity: qrValue ? 1 : 0.4,
              border: '1px solid var(--border-color)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: '#fff',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => { if (qrValue) e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.02)'; }}
          >
            <Download size={16} /> PDF (Print)
          </button>
          <button 
            disabled={!qrValue}
            onClick={() => handleDownload('jpeg')}
            style={{
              padding: '14px',
              borderRadius: '12px',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.85rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: qrValue ? 'pointer' : 'not-allowed',
              opacity: qrValue ? 1 : 0.4,
              border: '1px solid var(--border-color)',
              background: 'rgba(255, 255, 255, 0.02)',
              color: '#fff',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => { if (qrValue) e.target.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.02)'; }}
          >
            <Download size={16} /> JPG (Standard)
          </button>
        </div>

        {/* Copy Link & Share options */}
        <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '4px' }}>
          <button
            disabled={!qrValue}
            onClick={handleCopyLink}
            style={{
              flexGrow: 1,
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.01)',
              color: copied ? '#10B981' : '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: qrValue ? 'pointer' : 'not-allowed',
              opacity: qrValue ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { if (qrValue) e.target.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.01)'; }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied Content!' : 'Copy Value'}
          </button>

          <button
            disabled={!qrValue}
            onClick={() => setIsShareOpen(true)}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.01)',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: qrValue ? 'pointer' : 'not-allowed',
              opacity: qrValue ? 1 : 0.4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => { if (qrValue) e.target.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.01)'; }}
          >
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      {/* Share Modal Dialog */}
      <AnimatePresence>
        {isShareOpen && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(8px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={() => setIsShareOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card"
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '30px',
                background: '#111111',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1.25rem', fontWeight: 800 }}>
                Share QR Target
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '-10px' }}>
                Distribute this scannable resource with colleagues or clients.
              </p>

              {/* Share links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a 
                  href={`mailto:?subject=Scannable QR Code Resource&body=Please open this link to check details: ${encodeURIComponent(qrValue)}`}
                  style={shareLinkStyle}
                >
                  <Mail size={16} color="var(--primary-color)" /> Email Target
                </a>
                <a 
                  href={`https://wa.me/?text=Check out this link: ${encodeURIComponent(qrValue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={shareLinkStyle}
                >
                  <MessageSquare size={16} color="#25D366" /> Share to WhatsApp
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?text=Check this custom QR target: ${encodeURIComponent(qrValue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={shareLinkStyle}
                >
                  <X size={16} color="#ffffff" /> Post on X (Twitter)
                </a>
                <a 
                  href={`https://t.me/share/url?url=${encodeURIComponent(qrValue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={shareLinkStyle}
                >
                  <Send size={16} color="#0088cc" /> Send via Telegram
                </a>
              </div>

              <button
                onClick={() => setIsShareOpen(false)}
                className="btn-gradient"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  width: '100%',
                  marginTop: '10px',
                  border: 'none',
                  color: '#000'
                }}
              >
                Close Share
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const shareLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '10px',
  color: '#fff',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'background 0.3s ease'
};
