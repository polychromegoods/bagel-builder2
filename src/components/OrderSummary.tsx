import React from 'react';
import { useBagelStore } from '../store/bagelStore';
import { ShoppingCart } from 'lucide-react';

export const OrderSummary: React.FC = () => {
  const { order, getVariantTitle, resetOrder } = useBagelStore();

  const handleAddToCart = () => {
    // In a real app, this would integrate with Shopify
    const orderData = {
      variant: getVariantTitle(),
      recipe: JSON.stringify(order),
      timestamp: new Date().toISOString()
    };
    
    console.log('Adding to cart:', orderData);
    alert('Order added to cart! (This would integrate with Shopify in production)');
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