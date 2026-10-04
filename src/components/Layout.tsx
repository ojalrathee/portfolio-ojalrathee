import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MobileDrawer from '@/components/MobileDrawer';
import Footer from '@/components/Footer';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0b1326] text-slate-900 dark:text-[#dae2fd] antialiased selection:bg-[#2563eb] selection:text-[#eeefff] relative overflow-x-hidden transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.08),rgba(248,250,252,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.18),rgba(11,19,38,0))]" />
      <div className="fixed bottom-0 right-0 pointer-events-none -z-10 w-96 h-96 bg-[radial-gradient(circle,rgba(125,76,231,0.05),transparent_70%)] dark:bg-[radial-gradient(circle,rgba(125,76,231,0.12),transparent_70%)]" />

      {/* Top Header */}
      <Header
        isMenuOpen={mobileMenuOpen}
        onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Left Sidebar on desktop */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace */}
      <div className="lg:pl-72 w-full">
        <main className="w-full pt-24 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-140px)]">
          <div className="max-w-6xl w-full mx-auto">
            <Outlet />
          </div>
        </main>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </div>
    </div>
  );
}
