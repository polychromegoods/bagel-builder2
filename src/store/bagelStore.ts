import { create } from 'zustand';
import { BagelOrder, BagelBase, Shmear, EggType, MeatType, VeggieType, CheeseType, CondimentType, NAME_COLORS } from '../types/bagel';

interface BagelStore {
  order: BagelOrder;
  getExportedImageBase64: (() => string | null) | null;
  updateBase: (base: BagelBase) => void;
  toggleToasted: () => void;
  updateShmear: (shmear: Shmear) => void;
  updateEgg: (egg?: EggType) => void;
  updateMeat: (meat?: MeatType) => void;
  toggleVeggie: (veggie: VeggieType) => void;
  updateCheese: (cheese?: CheeseType) => void;
  toggleCondiment: (condiment: CondimentType) => void;
  updateCustomerName: (name: string) => void;
  updateNameColor: (color: string) => void;
  updateTextStyle: (style: 'colored' | 'black') => void;
  setExportedImageBase64Function: (fn: (() => string | null) | null) => void;
  resetOrder: () => void;
  getVariantTitle: () => string;
}

const initialOrder: BagelOrder = {
  base: 'plain',
  toasted: false,
  shmear: 'none',
  veggies: [],
  condiments: [],
  customerName: '',
  nameColor: NAME_COLORS[0],
  textStyle: 'colored'
};

export const useBagelStore = create<BagelStore>((set, get) => ({
  order: initialOrder,
  getExportedImageBase64: null,
  
  updateBase: (base) => set((state) => ({ 
    order: { ...state.order, base } 
  })),
  
  toggleToasted: () => set((state) => ({ 
    order: { ...state.order, toasted: !state.order.toasted } 
  })),
  
  updateShmear: (shmear) => set((state) => ({ 
    order: { ...state.order, shmear } 
  })),
  
  updateEgg: (egg) => set((state) => ({ 
    order: { ...state.order, egg } 
  })),
  
  updateMeat: (meat) => set((state) => ({ 
    order: { ...state.order, meat } 
  })),
  
  toggleVeggie: (veggie) => set((state) => {
    const veggies = state.order.veggies.includes(veggie)
      ? state.order.veggies.filter(v => v !== veggie)
      : [...state.order.veggies, veggie];
    return { order: { ...state.order, veggies } };
  }),
  
  updateCheese: (cheese) => set((state) => ({ 
    order: { ...state.order, cheese } 
  })),
  
  toggleCondiment: (condiment) => set((state) => {
    const condiments = state.order.condiments.includes(condiment)
      ? state.order.condiments.filter(c => c !== condiment)
      : [...state.order.condiments, condiment];
    return { order: { ...state.order, condiments } };
  }),
  
  updateCustomerName: (customerName) => set((state) => ({ 
    order: { ...state.order, customerName } 
  })),
  
  updateNameColor: (nameColor) => set((state) => ({ 
    order: { ...state.order, nameColor } 
  })),
  
  updateTextStyle: (textStyle) => set((state) => ({ 
    order: { ...state.order, textStyle } 
  })),
  
  setExportedImageBase64Function: (fn) => set({ getExportedImageBase64: fn }),
  
  resetOrder: () => set({ order: initialOrder }),
  
  getVariantTitle: () => {
    const { order } = get();
    const parts = [];
    
    // Base
    const baseNames = {
      'plain': 'Bagel',
      'sesame': 'Sesame',
      'raisin': 'Raisin',
      'everything': 'Everything',
      'whole-wheat': 'Whole Wheat'
    };
    parts.push(baseNames[order.base]);
    
    // Toasted
    if (order.toasted) parts.push('Toasted');
    
    // Shmear
    if (order.shmear !== 'none') {
      const shmearNames = {
        'plain-cream-cheese': 'Cream Cheese',
        'scallion': 'Scallion Cream Cheese',
        'tofu': 'Tofu Cream Cheese',
        'strawberry': 'Strawberry Cream Cheese',
        'garlic-herb': 'Garlic Herb Cream Cheese',
        'butter': 'Butter',
        'peanut-butter': 'Peanut Butter'
      };
      parts.push(shmearNames[order.shmear]);
    }
    
    // Add-ons
    const addOns = [];
    if (order.egg) {
      const eggNames = {
        'egg': 'Egg',
        'scrambled': 'Scrambled Eggs',
        'fried': 'Fried Egg',
        'over-easy': 'Over Easy Egg'
      };
      addOns.push(eggNames[order.egg]);
    }
    
    if (order.meat) {
      const meatNames = {
        'ham': 'Ham',
        'sausage': 'Sausage',
        'bacon': 'Bacon',
        'turkey': 'Turkey',
        'lox': 'Lox'
      };
      addOns.push(meatNames[order.meat]);
    }
    
    if (order.cheese) {
      const cheeseNames = {
        'american': 'American Cheese',
        'swiss': 'Swiss Cheese',
        'cheddar': 'Cheddar Cheese',
        'pepper-jack': 'Pepper Jack Cheese'
      };
      addOns.push(cheeseNames[order.cheese]);
    }
    
    order.veggies.forEach(veggie => {
      const veggieNames = {
        'red-onion': 'Red Onion',
        'lettuce': 'Lettuce',
        'tomato': 'Tomato',
        'jalapenos': 'Jalapeños',
        'avocado': 'Avocado',
        'cucumber': 'Cucumber',
        'pickles': 'Pickles',
        'capers': 'Capers'
      };
      addOns.push(veggieNames[veggie]);
    });
    
    order.condiments.forEach(condiment => {
      const condimentNames = {
        'salt': 'Salt',
        'pepper': 'Pepper',
        'ketchup': 'Ketchup',
        'mayo': 'Mayo'
      };
      addOns.push(condimentNames[condiment]);
    });
    
    if (addOns.length > 0) {
      parts.push(addOns.join(' + '));
    }
    
    return parts.join(' • ');
  }
}));