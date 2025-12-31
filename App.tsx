
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ToolDetail from './pages/ToolDetail';
import LegalPage from './pages/LegalPage';
import AgeCalculator from './pages/AgeCalculator';
import BMICalculator from './pages/BMICalculator';
import PercentageCalculator from './pages/PercentageCalculator';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Legal Pages */}
            <Route path="/privacy-policy" element={<LegalPage title="Privacy Policy" />} />
            <Route path="/terms-and-conditions" element={<LegalPage title="Terms and Conditions" />} />
            <Route path="/disclaimer" element={<LegalPage title="Disclaimer" />} />
            <Route path="/about-us" element={<LegalPage title="About Us" />} />
            <Route path="/contact-us" element={<LegalPage title="Contact Us" />} />

            {/* Dedicated Calculator Routes */}
            <Route path="/age-calculator" element={<AgeCalculator />} />
            <Route path="/bmi-calculator" element={<BMICalculator />} />
            <Route path="/percentage-calculator" element={<PercentageCalculator />} />

            {/* Catch-all Dynamic Tool Route */}
            <Route path="/:slug" element={<ToolDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
