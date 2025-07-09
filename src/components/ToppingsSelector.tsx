import React from 'react';
import { useBagelStore } from '../store/bagelStore';
import { EggType, MeatType, VeggieType, CheeseType, CondimentType } from '../types/bagel';

export const ToppingsSelector: React.FC = () => {
  const { order, updateEgg, updateMeat, toggleVeggie, updateCheese, toggleCondiment } = useBagelStore();

  const eggs: { value: EggType; label: string }[] = [
    { value: 'egg', label: 'Egg' },
    { value: 'scrambled', label: 'Scrambled' },
    { value: 'fried', label: 'Fried' },
    { value: 'over-easy', label: 'Over Easy' },
  ];

  const meats: { value: MeatType; label: string }[] = [
    { value: 'ham', label: 'Ham' },
    { value: 'sausage', label: 'Sausage' },
    { value: 'bacon', label: 'Bacon' },
    { value: 'turkey', label: 'Turkey' },
    { value: 'lox', label: 'Lox' },
  ];

  const veggies: { value: VeggieType; label: string }[] = [
    { value: 'red-onion', label: 'Red Onion' },
    { value: 'lettuce', label: 'Lettuce' },
    { value: 'tomato', label: 'Tomato' },
    { value: 'jalapenos', label: 'Jalapeños' },
    { value: 'avocado', label: 'Avocado' },
    { value: 'cucumber', label: 'Cucumber' },
    { value: 'pickles', label: 'Pickles' },
    { value: 'capers', label: 'Capers' },
  ];

  const cheeses: { value: CheeseType; label: string }[] = [
    { value: 'american', label: 'American Cheese' },
    { value: 'swiss', label: 'Swiss Cheese' },
    { value: 'cheddar', label: 'Cheddar Cheese' },
    { value: 'pepper-jack', label: 'Pepper Jack Cheese' },
  ];

  const condiments: { value: CondimentType; label: string }[] = [
    { value: 'salt', label: 'Salt' },
    { value: 'pepper', label: 'Pepper' },
    { value: 'ketchup', label: 'Ketchup' },
    { value: 'mayo', label: 'Mayo' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Add Your Toppings</h3>
      
      {/* Meat */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-2 sm:mb-3">Meat (choose one)</h4>
        <div className="space-y-1 sm:space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="meat"
              checked={!order.meat}
              onChange={() => updateMeat(undefined)}
              className="w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">None</span>
          </label>
          {meats.map((meat) => (
            <label key={meat.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="meat"
                value={meat.value}
                checked={order.meat === meat.value}
                onChange={() => updateMeat(meat.value)}
                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-700">{meat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Eggs */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-2 sm:mb-3">Eggs (choose one)</h4>
        <div className="space-y-1 sm:space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="egg"
              checked={!order.egg}
              onChange={() => updateEgg(undefined)}
              className="w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">None</span>
          </label>
          {eggs.map((egg) => (
            <label key={egg.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="egg"
                value={egg.value}
                checked={order.egg === egg.value}
                onChange={() => updateEgg(egg.value)}
                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-700">{egg.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cheese */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-2 sm:mb-3">Cheese (choose one)</h4>
        <div className="space-y-1 sm:space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="cheese"
              checked={!order.cheese}
              onChange={() => updateCheese(undefined)}
              className="w-4 h-4 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-700">None</span>
          </label>
          {cheeses.map((cheese) => (
            <label key={cheese.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="cheese"
                value={cheese.value}
                checked={order.cheese === cheese.value}
                onChange={() => updateCheese(cheese.value)}
                className="w-4 h-4 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-gray-700">{cheese.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Veggies */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-2 sm:mb-3">Veggies (select multiple)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
          {veggies.map((veggie) => (
            <label key={veggie.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={order.veggies.includes(veggie.value)}
                onChange={() => toggleVeggie(veggie.value)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 text-sm">{veggie.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condiments */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-2 sm:mb-3">Condiments (select multiple)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
          {condiments.map((condiment) => (
            <label key={condiment.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={order.condiments.includes(condiment.value)}
                onChange={() => toggleCondiment(condiment.value)}
                className="w-4 h-4 text-blue-500 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 text-sm">{condiment.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};