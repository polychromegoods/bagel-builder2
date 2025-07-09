import React from 'react';
import { useBagelStore } from '../store/bagelStore';
import { BagelBase, NAME_COLORS } from '../types/bagel';

export const BaseSelector: React.FC = () => {
  const { order, updateBase, toggleToasted, updateCustomerName, updateNameColor } = useBagelStore();

  const bases: { value: BagelBase; label: string; image: string }[] = [
    { value: 'plain', label: 'Bagel', image: '/plain bagel.png' },
    { value: 'sesame', label: 'Sesame', image: '/sesame bagel copy.png' },
    { value: 'raisin', label: 'Raisin', image: '/raisin bagel.png' },
    { value: 'everything', label: 'Everything', image: '/everything bagel.png' },
    { value: 'whole-wheat', label: 'Whole Wheat', image: '/whole wheat.png' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Choose Your Base</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
          {bases.map((base) => (
            <button
              key={base.value}
              onClick={() => updateBase(base.value)}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                order.base === base.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={base.image}
                alt={base.label}
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 object-cover rounded-full"
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700">{base.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-700 mb-2 sm:mb-3">Preparation</h4>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={order.toasted}
            onChange={toggleToasted}
            className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
          />
          <span className="text-gray-700">Toasted</span>
        </label>
      </div>

    </div>
  );
};