
import React, { useState } from 'react';
import AdPlaceholder from '../components/AdPlaceholder';
import { DISCLAIMER_TEXT } from '../constants';

const CNICChecker: React.FC = () => {
  const [cnic, setCnic] = useState('');
  const [result, setResult] = useState<{ isValid: boolean; province?: string; message: string } | null>(null);

  const validateCnic = () => {
    const cleanCnic = cnic.replace(/-/g, '');
    const regex = /^\d{13}$/;
    
    if (!regex.test(cleanCnic)) {
      setResult({ isValid: false, message: 'Invalid CNIC format. Please enter 13 digits (xxxxx-xxxxxxx-x).' });
      return;
    }

    const firstDigit = parseInt(cleanCnic[0]);
    let province = 'Unknown';
    switch (firstDigit) {
      case 1: province = 'Khyber Pakhtunkhwa (KPK)'; break;
      case 2: province = 'FATA'; break;
      case 3: province = 'Punjab'; break;
      case 4: province = 'Sindh'; break;
      case 5: province = 'Balochistan'; break;
      case 6: province = 'Islamabad (ICT)'; break;
      case 7: province = 'Gilgit Baltistan'; break;
    }

    setResult({
      isValid: true,
      province,
      message: `Format is valid! This CNIC belongs to ${province}.`
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">CNIC Format Checker</h1>
      <p className="text-gray-600 mb-8">Legal verification of Pakistan CNIC structure and province detection.</p>
      
      <AdPlaceholder slot="above-tool" />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Enter CNIC Number</label>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="e.g. 35201-1234567-1" 
            className="flex-grow border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            value={cnic}
            onChange={(e) => setCnic(e.target.value)}
          />
          <button 
            onClick={validateCnic}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition"
          >
            Verify
          </button>
        </div>
        
        {result && (
          <div className={`mt-6 p-4 rounded-xl border ${result.isValid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <p className="font-bold mb-1">{result.isValid ? '✅ Valid' : '❌ Error'}</p>
            <p>{result.message}</p>
            {result.isValid && (
              <div className="mt-4 text-sm space-y-2">
                <p><strong>Province:</strong> {result.province}</p>
                <div className="bg-white p-3 rounded border border-emerald-100 mt-4">
                    <p className="font-bold text-gray-800 mb-1">PTA SIM Rule Info:</p>
                    <p className="text-xs">Under PTA rules, you can have a maximum of 5 SIM cards on a single CNIC. Check your registered SIMs by sending your CNIC to 668.</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
           <p className="text-xs text-gray-500 mb-4">{DISCLAIMER_TEXT}</p>
           <button onClick={handleCopy} className="text-emerald-600 text-sm font-semibold flex items-center">
             <span>🔗 Share Tool Link</span>
           </button>
        </div>
      </div>

      <AdPlaceholder slot="below-tool" />

      <section className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100 prose prose-sm">
        <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-emerald-800">What does the first digit of CNIC mean?</h3>
            <p>The first digit of the CNIC (National Identity Card) indicates the province of the holder: 1 for KPK, 2 for FATA, 3 for Punjab, 4 for Sindh, 5 for Balochistan, 6 for Islamabad, and 7 for Gilgit Baltistan.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">Can I see my photo using this tool?</h3>
            <p>No. This tool only validates the format and structure. It does NOT connect to NADRA databases to fetch personal information, photos, or biometric data.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CNICChecker;
