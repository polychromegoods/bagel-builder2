export interface BagelOrder {
  base: BagelBase;
  toasted: boolean;
  shmear: Shmear;
  egg?: EggType;
  meat?: MeatType;
  veggies: VeggieType[];
  cheese?: CheeseType;
  condiments: CondimentType[];
  customerName?: string;
  nameColor: string;
  textStyle: 'colored' | 'black';
}

export type BagelBase = 'plain' | 'sesame' | 'raisin' | 'everything' | 'whole-wheat';
export type Shmear = 'none' | 'plain-cream-cheese' | 'scallion' | 'tofu' | 'strawberry' | 'garlic-herb' | 'butter' | 'peanut-butter';
export type EggType = 'egg' | 'scrambled' | 'fried' | 'over-easy';
export type MeatType = 'ham' | 'sausage' | 'bacon' | 'turkey' | 'lox';
export type VeggieType = 'red-onion' | 'lettuce' | 'tomato' | 'jalapenos' | 'avocado' | 'cucumber' | 'pickles' | 'capers';
export type CheeseType = 'american' | 'swiss' | 'cheddar' | 'pepper-jack';
export type CondimentType = 'salt' | 'pepper' | 'ketchup' | 'mayo';

export interface IngredientColors {
  [key: string]: string;
}

export const INGREDIENT_COLORS: IngredientColors = {
  // Shmears
  'plain-cream-cheese': '#F5F5DC',
  'scallion': '#90EE90',
  'tofu': '#FFFACD',
  'strawberry': '#FFB6C1',
  'garlic-herb': '#9ACD32',
  'butter': '#FFD700',
  'peanut-butter': '#D2691E',
  
  // Eggs
  'egg': '#FFA500',
  'scrambled': '#FFA500',
  'fried': '#FFA500',
  'over-easy': '#FFA500',
  
  // Meats
  'ham': '#ed5075',
  'sausage': '#CD853F',
  'bacon': '#D2691E',
  'turkey': '#D2B48C',
  'lox': '#FFA07A',
  
  // Veggies
  'red-onion': '#B19CD9',
  'lettuce': '#90EE90',
  'tomato': '#FF6347',
  'jalapenos': '#32CD32',
  'avocado': '#9ACD32',
  'cucumber': '#98FB98',
  'pickles': '#ADFF2F',
  'capers': '#556B2F',
  
  // Cheese
  'american': '#ffeb70',
  'swiss': '#ffeb70',
  'cheddar': '#ffeb70',
  'pepper-jack': '#ffeb70',
  
  // Condiments
  'salt': '#FFFFFF',
  'pepper': '#2F2F2F',
  'ketchup': '#C21807',
  'mayo': '#F5F5DC'
};

// Add bagel base colors
INGREDIENT_COLORS['plain'] = '#D2B48C';
INGREDIENT_COLORS['sesame'] = '#DEB887';
INGREDIENT_COLORS['raisin'] = '#380a4e';
INGREDIENT_COLORS['everything'] = '#A0522D';
INGREDIENT_COLORS['whole-wheat'] = '#8B7355';

export const NAME_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7'  // Yellow
];