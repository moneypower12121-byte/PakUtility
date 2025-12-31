
import React from 'react';

interface AdPlaceholderProps {
  slot?: string;
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot = "general", className = "" }) => {
  return (
    <div className={`my-6 mx-auto bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center p-4 text-gray-400 text-xs text-center min-h-[100px] ${className}`}>
      <div>
        <p className="font-bold uppercase mb-1">Advertisement Space</p>
        <p>Google AdSense Slot: {slot}</p>
      </div>
    </div>
  );
};

export default AdPlaceholder;
