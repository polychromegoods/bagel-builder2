import React from 'react';
import { useBagelStore } from '../store/bagelStore';
import { ShoppingCart } from 'lucide-react';

export const OrderSummary: React.FC = () => {
  const { order, getVariantTitle, resetOrder, getExportedImageBase64 } = useBagelStore();

  const handleAddToCart = async () => {
    try {
      // Check if the export function is available
      if (!getExportedImageBase64) {
        alert('Canvas not ready! Please wait a moment and try again.');
        return;
      }

      // Capture the PNG
      const base64 = getExportedImageBase64();
      if (!base64) {
        alert('Failed to generate image! Please try again.');
        return;
      }

      // POST it to Remix API
      const response = await fetch('/api/upload-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64 })
      });

      if (!response.ok) {
        throw new Error('Failed to upload design');
      }

      const { variantId } = await response.json();

      // Add that brand-new variant to cart
      const cartResponse = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(variantId.split('/').pop()),
          quantity: 1
        })
      });

      if (!cartResponse.ok) {
        throw new Error('Failed to add to cart');
      }

      // Redirect to cart
      window.location.href = '/cart';
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Your Bagel:</h4>
        <p className="text-gray-700 text-sm leading-relaxed">{getVariantTitle()}</p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={20} />
          <span>Add to Cart</span>
        </button>
        
        <button
          onClick={resetOrder}
          className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Start Over
        </button>
      </div>
    </div>
  );
};