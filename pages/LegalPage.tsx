
import React from 'react';

interface LegalPageProps {
  title: string;
}

const LegalPage: React.FC<LegalPageProps> = ({ title }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4">{title}</h1>
      <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed space-y-4">
        <p>Welcome to <strong>PakUtility</strong>. This page outlines our {title.toLowerCase()} which governs the use of our services.</p>
        
        <h2 className="text-xl font-bold text-gray-800 mt-6">Overview</h2>
        <p>PakUtility is an independent utility tools provider. We aim to offer free and accessible calculators for the people of Pakistan. Our tools include electricity bill estimators, tax calculators, and more.</p>

        <h2 className="text-xl font-bold text-gray-800 mt-6">Data Privacy</h2>
        <p>We do not store, collect, or share your personal data. All calculations performed on our website are done client-side in your browser. We do not have access to your private records from government agencies like NADRA, FBR, or PTA.</p>

        <h2 className="text-xl font-bold text-gray-800 mt-6">Disclaimer</h2>
        <p>The information provided by our tools is for estimation purposes only. Users are advised to verify all financial data with official departments before making payments or legal decisions. We are not responsible for any discrepancies between our estimates and official bills or taxes.</p>

        <h2 className="text-xl font-bold text-gray-800 mt-6">Contact Us</h2>
        <p>If you have questions regarding this {title.toLowerCase()}, please contact us via our official support channels at support@pakutility.xyz.</p>

        <p className="text-xs text-gray-400 mt-12 italic">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default LegalPage;
