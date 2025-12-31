
import React from 'react';

interface AdPlaceholderProps {
  slot?: string;
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot = "general", className = "" }) => {
  return (
    <div
      className={`my-6 mx-auto bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center p-4 text-gray-400 text-xs text-center min-h-[100px] ${className}`}
      style={slot === 'left-banner' || slot === 'right-banner' ? { width: 160, height: 600, minWidth: 160, minHeight: 600 } : {}}
    >
      <div>
        <p className="font-bold uppercase mb-1">Advertisement Space</p>
        <p>Google AdSense Slot: {slot}</p>
        {(slot === 'left-banner' || slot === 'right-banner') && (
          <span className="block mt-2 text-[10px]">160x600</span>
        )}
      </div>
    </div>
  );
};

export default AdPlaceholder;
