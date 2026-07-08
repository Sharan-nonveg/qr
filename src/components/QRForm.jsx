import React, { useState, useEffect } from 'react';
import { 
  Globe, Phone, MessageSquare, Wifi, 
  FileText, AlertCircle, CheckCircle2, UploadCloud
} from 'lucide-react';

export default function QRForm({ selectedType, formData, setFormData, errors, setErrors, setQrValue }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    updateQrValue();
  }, [formData, selectedType]);

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    validateField(field, value, newFormData);
  };

  const validateField = (field, value, currentData) => {
    let errs = { ...errors };

    if (selectedType === 'website' && field === 'websiteUrl') {
      if (!value) {
        errs.websiteUrl = 'Please enter a URL.';
      } else if (!/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/.test(value)) {
        errs.websiteUrl = 'Please enter a valid URL (e.g., https://example.com).';
      } else {
        delete errs.websiteUrl;
      }
    }

    if (selectedType === 'whatsapp') {
      if (field === 'whatsappPhone') {
        if (!value) {
          errs.whatsappPhone = 'Please enter a phone number.';
        } else if (!/^\+?[0-9\s-]{6,15}$/.test(value)) {
          errs.whatsappPhone = 'Please enter a valid phone number.';
        } else {
          delete errs.whatsappPhone;
        }
      }
      if (field === 'whatsappCode') {
        if (!value) {
          errs.whatsappCode = 'Required.';
        } else if (!/^\+?[0-9]{1,4}$/.test(value)) {
          errs.whatsappCode = 'Invalid code.';
        } else {
          delete errs.whatsappCode;
        }
      }
    }

    if (selectedType === 'wifi') {
      if (field === 'wifiSsid') {
        if (!value) errs.wifiSsid = 'SSID (network name) is required.';
        else delete errs.wifiSsid;
      }
    }

    if (selectedType === 'text' && field === 'textContent') {
      if (!value) errs.textContent = 'Text content is required.';
      else delete errs.textContent;
    }

    if (selectedType === 'vcard') {
      if (field === 'vcardFirstName') {
        if (!value) errs.vcardFirstName = 'First name is required.';
        else delete errs.vcardFirstName;
      }
      if (field === 'vcardLastName') {
        if (!value) errs.vcardLastName = 'Last name is required.';
        else delete errs.vcardLastName;
      }
      if (field === 'vcardPhone') {
        if (!value) {
          errs.vcardPhone = 'Phone number is required.';
        } else if (!/^\+?[0-9\s-]{6,15}$/.test(value)) {
          errs.vcardPhone = 'Please enter a valid phone number.';
        } else {
          delete errs.vcardPhone;
        }
      }
      if (field === 'vcardEmail') {
        if (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          errs.vcardEmail = 'Please enter a valid email.';
        } else {
          delete errs.vcardEmail;
        }
      }
    }

    setErrors(errs);
  };

  const updateQrValue = () => {
    const hasErrors = Object.keys(errors).length > 0;
    
    if (hasErrors) {
      setQrValue('');
      return;
    }

    switch (selectedType) {
      case 'website':
        if (formData.websiteUrl) {
          let url = formData.websiteUrl;
          if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
          }
          setQrValue(url);
        } else {
          setQrValue('');
        }
        break;

      case 'whatsapp':
        if (formData.whatsappPhone && formData.whatsappCode) {
          const rawPhone = formData.whatsappCode.replace('+', '') + formData.whatsappPhone.replace(/[\s-]/g, '');
          const message = encodeURIComponent(formData.whatsappMessage || '');
          setQrValue(`https://wa.me/${rawPhone}${message ? '?text=' + message : ''}`);
        } else {
          setQrValue('');
        }
        break;

      case 'wifi':
        if (formData.wifiSsid) {
          const encryption = formData.wifiSecurity || 'WPA';
          const hidden = formData.wifiHidden ? 'H:true' : '';
          setQrValue(`WIFI:S:${formData.wifiSsid};T:${encryption};P:${formData.wifiPassword || ''};${hidden};`);
        } else {
          setQrValue('');
        }
        break;

      case 'pdf':
        if (formData.pdfCdnUrl) {
          setQrValue(formData.pdfCdnUrl);
        } else {
          setQrValue('');
        }
        break;

      case 'text':
        if (formData.textContent) {
          setQrValue(formData.textContent);
        } else {
          setQrValue('');
        }
        break;

      case 'vcard':
        if (formData.vcardFirstName && formData.vcardLastName && formData.vcardPhone) {
          const vcardString = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `N:${formData.vcardLastName};${formData.vcardFirstName};;;`,
            `FN:${formData.vcardFirstName} ${formData.vcardLastName}`,
            formData.vcardOrg ? `ORG:${formData.vcardOrg}` : '',
            formData.vcardTitle ? `TITLE:${formData.vcardTitle}` : '',
            `TEL;TYPE=CELL:${formData.vcardPhone}`,
            formData.vcardEmail ? `EMAIL;TYPE=PREF,INTERNET:${formData.vcardEmail}` : '',
            formData.vcardUrl ? `URL:${formData.vcardUrl}` : '',
            formData.vcardAddress ? `ADR;TYPE=WORK:;;${formData.vcardAddress};;;;` : '',
            'END:VCARD'
          ].filter(Boolean).join('\n');
          setQrValue(vcardString);
        } else {
          setQrValue('');
        }
        break;

      default:
        setQrValue('');
    }
  };

  // Mock PDF Uploader Simulation
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrors({ ...errors, pdfFile: 'Please upload a valid PDF document.' });
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 50) {
      setErrors({ ...errors, pdfFile: 'File exceeds 50MB free limits.' });
      return;
    }

    delete errors.pdfFile;
    setErrors({ ...errors });
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSuccess(false);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadSuccess(true);
          const mockCdnUrl = `https://cdn.codemeshflow.in/files/pdf_${Math.random().toString(36).substring(2, 9)}.pdf`;
          setFormData((prevData) => ({
            ...prevData,
            pdfCdnUrl: mockCdnUrl,
            pdfFileName: file.name
          }));
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 1. WEBSITE */}
      {selectedType === 'website' && (
        <div className="input-group">
          <label className="input-label" htmlFor="websiteUrl">
            <span>Website URL</span>
            <Globe size={16} color="var(--primary-color)" />
          </label>
          <input 
            id="websiteUrl"
            type="text" 
            className="input-field" 
            placeholder="https://example.com"
            value={formData.websiteUrl || ''}
            onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
          />
          <div className="input-helper">Paste your website, social profile, or portfolio URL.</div>
          {errors.websiteUrl && (
            <div className="input-error">
              <AlertCircle size={14} /> {errors.websiteUrl}
            </div>
          )}
        </div>
      )}

      {/* 2. WHATSAPP */}
      {selectedType === 'whatsapp' && (
        <div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="input-group" style={{ width: '100px' }}>
              <label className="input-label" htmlFor="whatsappCode">Code</label>
              <input 
                id="whatsappCode"
                type="text" 
                className="input-field" 
                placeholder="+1"
                value={formData.whatsappCode || ''}
                onChange={(e) => handleInputChange('whatsappCode', e.target.value)}
              />
              {errors.whatsappCode && <div className="input-error">{errors.whatsappCode}</div>}
            </div>
            <div className="input-group" style={{ flexGrow: 1 }}>
              <label className="input-label" htmlFor="whatsappPhone">
                <span>Phone Number</span>
                <Phone size={16} color="var(--primary-color)" />
              </label>
              <input 
                id="whatsappPhone"
                type="text" 
                className="input-field" 
                placeholder="202 555 0199"
                value={formData.whatsappPhone || ''}
                onChange={(e) => handleInputChange('whatsappPhone', e.target.value)}
              />
              {errors.whatsappPhone && (
                <div className="input-error">
                  <AlertCircle size={14} /> {errors.whatsappPhone}
                </div>
              )}
            </div>
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="whatsappMessage">
              <span>Pre-filled Message (Optional)</span>
              <MessageSquare size={16} color="var(--text-secondary)" />
            </label>
            <textarea 
              id="whatsappMessage"
              className="input-field" 
              placeholder="Hi! I am scanning to query about your services..."
              rows="3"
              style={{ resize: 'vertical' }}
              value={formData.whatsappMessage || ''}
              onChange={(e) => handleInputChange('whatsappMessage', e.target.value)}
            />
            <div className="input-helper">This text will auto-load in the user's chat screen.</div>
          </div>
        </div>
      )}

      {/* 3. WIFI */}
      {selectedType === 'wifi' && (
        <div>
          <div className="input-group">
            <label className="input-label" htmlFor="wifiSsid">
              <span>SSID / Network Name</span>
              <Wifi size={16} color="var(--primary-color)" />
            </label>
            <input 
              id="wifiSsid"
              type="text" 
              className="input-field" 
              placeholder="MyHomeNetwork_5G"
              value={formData.wifiSsid || ''}
              onChange={(e) => handleInputChange('wifiSsid', e.target.value)}
            />
            {errors.wifiSsid && (
              <div className="input-error">
                <AlertCircle size={14} /> {errors.wifiSsid}
              </div>
            )}
          </div>
          <div className="input-group">
            <label className="input-label" htmlFor="wifiPassword">Password</label>
            <input 
              id="wifiPassword"
              type="password" 
              className="input-field" 
              placeholder="••••••••"
              value={formData.wifiPassword || ''}
              onChange={(e) => handleInputChange('wifiPassword', e.target.value)}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="wifiSecurity">Security Type</label>
              <select 
                id="wifiSecurity"
                className="input-field"
                style={{ appearance: 'none', background: 'rgba(15, 23, 42, 0.6) url("data:image/svg+xml;utf8,<svg fill=\'%2394A3B8\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>") no-repeat right 12px center' }}
                value={formData.wifiSecurity || 'WPA'}
                onChange={(e) => handleInputChange('wifiSecurity', e.target.value)}
              >
                <option value="WPA" style={{ background: '#0B1120', color: '#fff' }}>WPA/WPA2</option>
                <option value="WEP" style={{ background: '#0B1120', color: '#fff' }}>WEP</option>
                <option value="nopass" style={{ background: '#0B1120', color: '#fff' }}>Unsecured / None</option>
              </select>
            </div>
            <div className="input-group" style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                <input 
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: 'var(--primary-color)',
                    background: 'rgba(15,23,42,0.8)'
                  }}
                  checked={formData.wifiHidden || false}
                  onChange={(e) => handleInputChange('wifiHidden', e.target.checked)}
                />
                Hidden Network
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 4. PDF */}
      {selectedType === 'pdf' && (
        <div className="input-group">
          <label className="input-label">
            <span>Upload PDF File</span>
            <FileText size={16} color="var(--primary-color)" />
          </label>
          <div 
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '16px',
              padding: '40px 20px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.01)',
              cursor: 'pointer',
              transition: 'border-color 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            onClick={() => document.getElementById('pdfFileInput').click()}
          >
            <input 
              id="pdfFileInput"
              type="file" 
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handlePdfUpload}
            />
            <UploadCloud size={40} color="var(--text-secondary)" style={{ marginBottom: '12px' }} />
            <h5 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>
              Drag & Drop PDF or Click to Browse
            </h5>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Supports PDFs up to 50MB (100% Free)
            </span>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#fff', marginBottom: '6px' }}>
                <span>Uploading to CodeMeshFlow Cloud CDN...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${uploadProgress}%`, 
                    background: 'var(--primary-gradient)',
                    borderRadius: '99px',
                    transition: 'width 0.15s ease-out',
                    boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Success */}
          {uploadSuccess && (
            <div 
              style={{ 
                marginTop: '16px', 
                background: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid rgba(16, 185, 129, 0.2)', 
                padding: '12px 16px', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#34D399',
                fontSize: '0.9rem'
              }}
            >
              <CheckCircle2 size={16} />
              <span>
                Uploaded successfully! <strong>{formData.pdfFileName}</strong>
              </span>
            </div>
          )}

          {errors.pdfFile && (
            <div className="input-error" style={{ marginTop: '10px' }}>
              <AlertCircle size={14} /> {errors.pdfFile}
            </div>
          )}
        </div>
      )}

      {/* 5. TEXT */}
      {selectedType === 'text' && (
        <div className="input-group">
          <label className="input-label" htmlFor="textContent">
            <span>Plain Text Content</span>
            <FileText size={16} color="var(--primary-color)" />
          </label>
          <textarea 
            id="textContent"
            className="input-field" 
            placeholder="Type your notes or plain text messages here..."
            rows="5"
            style={{ resize: 'vertical' }}
            value={formData.textContent || ''}
            onChange={(e) => handleInputChange('textContent', e.target.value)}
          />
          <div className="input-helper">Keep it concise; longer texts make QR codes denser.</div>
          {errors.textContent && (
            <div className="input-error">
              <AlertCircle size={14} /> {errors.textContent}
            </div>
          )}
        </div>
      )}

      {/* 6. VCARD */}
      {selectedType === 'vcard' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="vcardFirstName">First Name</label>
              <input 
                id="vcardFirstName"
                type="text" 
                className="input-field" 
                placeholder="Alexander"
                value={formData.vcardFirstName || ''}
                onChange={(e) => handleInputChange('vcardFirstName', e.target.value)}
              />
              {errors.vcardFirstName && <div className="input-error">{errors.vcardFirstName}</div>}
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="vcardLastName">Last Name</label>
              <input 
                id="vcardLastName"
                type="text" 
                className="input-field" 
                placeholder="Hamilton"
                value={formData.vcardLastName || ''}
                onChange={(e) => handleInputChange('vcardLastName', e.target.value)}
              />
              {errors.vcardLastName && <div className="input-error">{errors.vcardLastName}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="vcardPhone">Phone Number</label>
              <input 
                id="vcardPhone"
                type="text" 
                className="input-field" 
                placeholder="+12025550199"
                value={formData.vcardPhone || ''}
                onChange={(e) => handleInputChange('vcardPhone', e.target.value)}
              />
              {errors.vcardPhone && <div className="input-error">{errors.vcardPhone}</div>}
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="vcardEmail">Email (Optional)</label>
              <input 
                id="vcardEmail"
                type="email" 
                className="input-field" 
                placeholder="alex@treasury.gov"
                value={formData.vcardEmail || ''}
                onChange={(e) => handleInputChange('vcardEmail', e.target.value)}
              />
              {errors.vcardEmail && <div className="input-error">{errors.vcardEmail}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="vcardOrg">Company / Org (Optional)</label>
              <input 
                id="vcardOrg"
                type="text" 
                className="input-field" 
                placeholder="US Treasury"
                value={formData.vcardOrg || ''}
                onChange={(e) => handleInputChange('vcardOrg', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="vcardTitle">Job Title (Optional)</label>
              <input 
                id="vcardTitle"
                type="text" 
                className="input-field" 
                placeholder="Secretary"
                value={formData.vcardTitle || ''}
                onChange={(e) => handleInputChange('vcardTitle', e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="vcardUrl">Website URL (Optional)</label>
            <input 
              id="vcardUrl"
              type="text" 
              className="input-field" 
              placeholder="https://treasury.gov"
              value={formData.vcardUrl || ''}
              onChange={(e) => handleInputChange('vcardUrl', e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="vcardAddress">Work Address (Optional)</label>
            <input 
              id="vcardAddress"
              type="text" 
              className="input-field" 
              placeholder="1500 Pennsylvania Ave NW, Washington, DC"
              value={formData.vcardAddress || ''}
              onChange={(e) => handleInputChange('vcardAddress', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
