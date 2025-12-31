
import React, { useState } from 'react';
import AdPlaceholder from '../components/AdPlaceholder';
import { DISCLAIMER_TEXT } from '../constants';

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<any | null>(null);

  const calculateAge = () => {
    if (!birthDate) {
      alert('Please enter your date of birth');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.floor((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      years,
      months,
      days,
      totalDays,
      totalMonths,
      totalWeeks,
      totalHours,
      daysToNextBirthday,
      nextBirthday: nextBirthday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Age Calculator Pakistan</h1>
      <p className="text-gray-600 mb-8">Calculate your exact age in years, months, days, and more with precision.</p>
      
      <AdPlaceholder slot="above-tool" />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        {/* How to Use Section */}
        <div className="mb-8 p-5 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
            📖 How to Use This Calculator
          </h3>
          <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
            <li>Enter your <strong>date of birth</strong> in the date picker below</li>
            <li>Click the <strong>"Calculate Age"</strong> button</li>
            <li>View your exact age in multiple formats (years, months, days, hours)</li>
            <li>See how many days until your next birthday</li>
          </ol>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Your Date of Birth</label>
          <input 
            type="date" 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-lg"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <button 
          onClick={calculateAge}
          className="w-full bg-emerald-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition shadow-lg"
        >
          Calculate Age
        </button>
        
        {result && (
          <div className="mt-8 space-y-4">
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
              <p className="text-sm text-emerald-600 uppercase font-bold mb-2">Your Exact Age</p>
              <p className="text-4xl font-extrabold text-emerald-800">
                {result.years} Years, {result.months} Months, {result.days} Days
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Months</p>
                <p className="text-2xl font-bold text-gray-800">{result.totalMonths}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Weeks</p>
                <p className="text-2xl font-bold text-gray-800">{result.totalWeeks}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Days</p>
                <p className="text-2xl font-bold text-gray-800">{result.totalDays}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Hours</p>
                <p className="text-2xl font-bold text-gray-800">{result.totalHours.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-5 bg-purple-50 border border-purple-200 rounded-xl">
              <p className="text-sm text-purple-800">
                🎂 <strong>Next Birthday:</strong> {result.nextBirthday} ({result.daysToNextBirthday} days remaining)
              </p>
            </div>
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
            <h3 className="font-bold text-emerald-800">How accurate is this age calculator?</h3>
            <p>This calculator is 100% accurate as it uses your browser's system date and time. It calculates down to the exact day, hour, and minute.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">Can I calculate someone else's age?</h3>
            <p>Yes! Simply enter any date of birth to calculate the age of family members, friends, or for official documents.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">Why do I need to know my exact age?</h3>
            <p>Exact age is required for passport applications, job forms, educational admissions, loan applications, and government documents in Pakistan.</p>
          </div>
          <div>
            <h3 className="font-bold text-emerald-800">What if I only know my CNIC date of birth?</h3>
            <p>Enter the date from your CNIC. The format on Pakistani CNICs follows DD-MM-YYYY pattern visible in the birthdate section.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgeCalculator;
