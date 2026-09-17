import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { ProblemSection } from './components/ProblemSection';
import { IncludedSection } from './components/IncludedSection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { PromptPreviewModal } from './components/PromptPreviewModal';
import { FloatingChatWidget } from './components/FloatingChatWidget';
import { AdminPage } from './components/AdminPage';
import { CoursePage } from './components/CoursePage';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { UserAccount } from './types';

export default function App() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPromptDemoOpen, setIsPromptDemoOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('anuncios_ia_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    // Default logged in user for seamless testing is Salvador Aliados Digitales (Admin)
    return {
      id: 'user-admin-default',
      email: 'salvadoraliadosdigitales@gmail.com',
      name: 'Salvador Aliados Digitales',
      role: 'admin',
      addedAt: '2026-08-08',
      hasCourseAccess: true,
    };
  });

  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState(false);

  const [currentView, setCurrentView] = useState<'landing' | 'course' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const isPayPalReturn =
        searchParams.has('subscription_id') ||
        searchParams.has('ba_token') ||
        searchParams.has('token') ||
        searchParams.has('plan_id') ||
        searchParams.get('status') === 'success' ||
        searchParams.get('payment') === 'success' ||
        searchParams.get('subscription') === 'success';

      if (window.location.pathname === '/admin') return 'admin';
      if (window.location.pathname === '/curso' || isPayPalReturn) return 'course';
    }
    return 'landing';
  });

  useEffect(() => {
    // Check if returning from PayPal subscription checkout
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const isPayPalReturn =
        searchParams.has('subscription_id') ||
        searchParams.has('ba_token') ||
        searchParams.has('token') ||
        searchParams.has('plan_id') ||
        searchParams.get('status') === 'success' ||
        searchParams.get('payment') === 'success' ||
        searchParams.get('subscription') === 'success';

      if (isPayPalReturn) {
        setPaymentSuccessNotice(true);
        try {
          const savedUserStr = localStorage.getItem('anuncios_ia_current_user');
          if (savedUserStr) {
            const user = JSON.parse(savedUserStr);
            user.hasCourseAccess = true;
            user.status = 'paid';
            user.isPaid = true;
            localStorage.setItem('anuncios_ia_current_user', JSON.stringify(user));
            setCurrentUser(user);

            // Notify backend of paid status
            fetch('/api/users/upgrade-paid', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                whatsapp: user.whatsapp,
                status: 'paid',
              }),
            }).catch(console.warn);
          }
        } catch (e) {
          console.warn(e);
        }

        // Navigate cleanly to /curso
        window.history.replaceState({}, '', '/curso');
        setCurrentView('course');
      }
    }

    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        setCurrentView('admin');
      } else if (window.location.pathname === '/curso') {
        setCurrentView('course');
      } else {
        setCurrentView('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const openAdmin = () => {
    setCurrentView('admin');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin');
    }
  };

  const openCourse = () => {
    setCurrentView('course');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/curso');
    }
  };

  const backToLanding = () => {
    setCurrentView('landing');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('anuncios_ia_current_user', JSON.stringify(user));
    } catch (e) {
      console.warn(e);
    }
    // Auto navigate to course if logging in
    openCourse();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('anuncios_ia_current_user');
    } catch (e) {
      console.warn(e);
    }
    backToLanding();
  };

  const handleCheckoutGoToCourse = (email?: string, name?: string) => {
    const userEmail = email || 'alumno.nuevo@gmail.com';
    const userName = name || 'Alumno';

    fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, name: userName, isPaid: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.user) {
          handleLoginSuccess(data.user);
        } else {
          openCourse();
        }
      })
      .catch(() => openCourse());
  };

  const handleScrollToExamples = () => {
    const el = document.getElementById('ejemplos');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (currentView === 'admin') {
    return <AdminPage onBackToLanding={backToLanding} currentUser={currentUser} />;
  }

  if (currentView === 'course') {
    return (
      <>
        <CoursePage
          currentUser={currentUser}
          onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
          onLogout={handleLogout}
          onOpenAdmin={openAdmin}
          onGoToLanding={backToLanding}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          showPaymentSuccessNotice={paymentSuccessNotice}
          onDismissSuccessNotice={() => setPaymentSuccessNotice(false)}
        />
        <GoogleAuthModal
          isOpen={isGoogleAuthOpen}
          onClose={() => setIsGoogleAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOpenManager={openAdmin}
          onGoToCourse={handleCheckoutGoToCourse}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-950 antialiased relative">
      {/* Sticky top promotional notice header */}
      <Header
        onCheckout={() => setIsCheckoutOpen(true)}
        onOpenLogin={() => setIsGoogleAuthOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Page Sections */}
      <main>
        {/* 1. Hero Section */}
        <HeroSection
          onScrollToExamples={handleScrollToExamples}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onStartFreeClass={() => setIsCheckoutOpen(true)}
        />

        {/* 2. Showcase / Examples Section */}
        <ShowcaseSection
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          isManagerOpen={false}
          onOpenManager={openAdmin}
          onCloseManager={backToLanding}
        />

        {/* 3. Problem & Comparison Section */}
        <ProblemSection />

        {/* 4. What's Included Section */}
        <IncludedSection onOpenPromptDemo={() => setIsPromptDemoOpen(true)} />

        {/* 5. Complete Access & Pricing Section */}
        <PricingSection
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onStartFreeClass={() => setIsCheckoutOpen(true)}
        />

        {/* 6. FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenManager={openAdmin}
      />

      {/* Floating AI Chat Assistant Widget for Prospects */}
      <FloatingChatWidget
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onStartFreeClass={() => setIsCheckoutOpen(true)}
      />

      {/* Interactive Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOpenManager={openAdmin}
        onGoToCourse={handleCheckoutGoToCourse}
      />

      <PromptPreviewModal
        isOpen={isPromptDemoOpen}
        onClose={() => setIsPromptDemoOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
