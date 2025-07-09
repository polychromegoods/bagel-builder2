import React from 'react';
import { useBagelStore } from '../store/bagelStore';
import { Shmear } from '../types/bagel';

export const ShmearSelector: React.FC = () => {
  const { order, updateShmear } = useBagelStore();

  const shmears: { value: Shmear; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'plain-cream-cheese', label: 'Cream Cheese' },
    { value: 'scallion', label: 'Scallion Cream Cheese' },
    { value: 'tofu', label: 'Tofu Cream Cheese' },
    { value: 'strawberry', label: 'Strawberry Cream Cheese' },
    { value: 'garlic-herb', label: 'Garlic Herb Cream Cheese' },
    { value: 'butter', label: 'Butter' },
    { value: 'peanut-butter', label: 'Peanut Butter' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Choose Your Shmear</h3>
      <div className="space-y-1 sm:space-y-2">
        {shmears.map((shmear) => (
          <label key={shmear.value} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="shmear"
              value={shmear.value}
              checked={order.shmear === shmear.value}
              onChange={() => updateShmear(shmear.value)}
              className="w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">{shmear.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};