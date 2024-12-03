// src/components/PriceDisplay.tsx
import React from 'react';

interface PriceDisplayProps {
  price: number | null;
  onGoBack: () => void;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, onGoBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-8 rounded-xl bg-gray-900/60 backdrop-blur-sm border border-purple-500/20">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Estimated Price</h1>
          <p className="text-purple-300">
            {price !== null ? `${price.toLocaleString()} TND` : 'Price data not found.'}
          </p>
        </div>
        <div className="flex justify-center">
          <button
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            onClick={onGoBack}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceDisplay;
