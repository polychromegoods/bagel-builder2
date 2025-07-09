import React from 'react';
import { useBagelStore } from '../store/bagelStore';
import { NAME_COLORS } from '../types/bagel';

export const NameCustomizer: React.FC = () => {
  const { order, updateCustomerName, updateNameColor, updateTextStyle } = useBagelStore();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Customize Your Design</h3>
      
      {/* Name Input */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">Your Name (optional)</h4>
        <input
          type="text"
          value={order.customerName || ''}
          onChange={(e) => updateCustomerName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
        />
      </div>

      {/* Name Color Selection */}
      {order.customerName && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">Name Color</h4>
          <div className="flex flex-wrap gap-3">
            {NAME_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => updateNameColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  order.nameColor === color
                    ? 'border-gray-800 scale-110'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Text Style Selection */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">Text Style</h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="textStyle"
              value="colored"
              checked={order.textStyle === 'colored'}
              onChange={() => updateTextStyle('colored')}
              className="w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">Colorful ingredients (each ingredient in its own color)</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="textStyle"
              value="black"
              checked={order.textStyle === 'black'}
              onChange={() => updateTextStyle('black')}
              className="w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">Uniform black text (all ingredients in black)</span>
          </label>
        </div>
      </div>
      
      {/* Preview Note */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Preview:</strong> Check the live preview to see how your customizations look on the t-shirt design.
        </p>
      </div>

      {!order.customerName && (
        <div className="text-gray-500 text-center py-8">
          <p>Add your name in Step 1 to customize the name color here.</p>
        </div>
      )}
    </div>
  );
};