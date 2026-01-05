
import React from 'react';

const SEOContent: React.FC = () => {
  return (
    <section className="mt-16 prose prose-emerald max-w-none bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Use PakUtility?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Navigating the complexities of utility bills, taxes, and religious obligations in Pakistan can be challenging. <strong>PakUtility</strong> is designed as a one-stop digital hub providing smart calculators to simplify these tasks for citizens. Whether you are a salaried individual checking your <strong>FBR Salary Tax</strong> for the new fiscal year or a homeowner estimating your monthly <strong>LESCO or IESCO bill</strong>, we provide accurate, data-driven estimates at your fingertips.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-emerald-800">100% Legal & Data-Secure</h3>
          <p className="text-gray-600">
            We prioritize your privacy. Unlike other platforms, PakUtility never accesses private government databases like NADRA or PTA. All validations, such as our <strong>CNIC Format Checker</strong>, rely purely on mathematical algorithms and public logic without storing any personal user data.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-emerald-800">Updated Tax Slabs</h3>
          <p className="text-gray-600">
            Pakistan's financial regulations change frequently. Our <strong>Salary Tax Calculator</strong> is updated for the 2024-25 budget year, ensuring your take-home pay estimations are as accurate as possible based on official FBR announcements.
          </p>
        </div>
      </div>
      <p className="text-gray-600 mt-6 italic">
        <strong>Disclaimer:</strong> All results provided by our tools are estimates. Please consult official government channels for final billing and legal tax filings.
      </p>
    </section>
  );
};

export default SEOContent;
