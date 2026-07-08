import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { Features, Testimonials, FAQ } from './components/SaaSElements';
import Footer from './components/Footer';

export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
      {/* 1. Global Space Background Animated Blobs */}
      <div className="bg-blob-container">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      {/* 2. Navigation Header */}
      <Navbar />

      {/* 3. Main Dashboard Workspace (Steps 1 to 5) */}
      <Dashboard />

      {/* 4. Features Section */}
      <Features />

      {/* 5. Testimonials Reviews */}
      <Testimonials />

      {/* 6. Accordion FAQs */}
      <FAQ />

      {/* 7. Modern Footer */}
      <Footer />
    </div>
  );
}
