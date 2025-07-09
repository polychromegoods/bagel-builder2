import React, { useRef, useEffect } from 'react';
import { useBagelStore } from '../store/bagelStore';
import { INGREDIENT_COLORS } from '../types/bagel';

interface BagelCanvasProps {
  className?: string;
}

interface Ingredient {
  name: string;
  color: string;
  addAmpersand?: boolean;
  isOnLine?: boolean;
  isBagelLine?: boolean;
}

// Constants for better maintainability
const CANVAS_CONFIG = {
  EXPORT_WIDTH: 3600,
  EXPORT_HEIGHT: 4800,
  ASPECT_RATIO: '3/4' as const,
  MIN_HEIGHT: '400px',
  MAX_HEIGHT: '600px',
  DPR_FALLBACK: 1,
};

const FONT_CONFIG = {
  FAMILY: '"Helvetica Neue", Arial, sans-serif',
  WEIGHT: 'bold',
  LINE_HEIGHT_MULTIPLIER: 1.2,
  TIGHT_LINE_HEIGHT_MULTIPLIER: 1.15,
};

const SIZING_CONFIG = {
  REFERENCE_WIDTH: 550,
  BASE_EXPORT_SIZE: 550,
  EVERYTHING_WHOLE_WHEAT_SCALE: 0.7,
  SESAME_SCALE: 0.9,
  MULTIPLE_INGREDIENTS_SCALE: 0.85,
  EVERYTHING_ALONE_SCALE: 1.1,
  MIN_PREVIEW_SIZE: 14,
  MIN_EXPORT_SIZE: 300,
  MAX_PREVIEW_SIZE: 32,
  MIN_BASE_PREVIEW_SIZE: 20,
};

const POSITION_CONFIG = {
  NAME_Y_PERCENT: 0.28,
  EXPORT_NAME_Y_PERCENT: 0.25,
  EXPORT_START_Y_WITH_NAME: 0.25,
  EXPORT_START_Y_WITHOUT_NAME: 0.2,
  PREVIEW_START_Y_FEW_INGREDIENTS_WITH_NAME: 0.38,
  PREVIEW_START_Y_MANY_INGREDIENTS_WITH_NAME: 0.35,
  PREVIEW_START_Y_FEW_INGREDIENTS_WITHOUT_NAME: 0.32,
  PREVIEW_START_Y_MANY_INGREDIENTS_WITHOUT_NAME: 0.28,
  MAX_Y_EXPORT: 0.95,
  MAX_Y_PREVIEW: 0.9,
  MAX_TEXT_HEIGHT_EXPORT: 0.65,
};

const STROKE_CONFIG = {
  COLOR: '#D3D3D3',
  WIDTH: 1,
};

export const BagelCanvas: React.FC<BagelCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { order, setExportedImageBase64Function } = useBagelStore();

  const generateExportBase64 = (): string | null => {
    // Create a temporary high-resolution canvas for export
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return null;
    
    tempCanvas.width = CANVAS_CONFIG.EXPORT_WIDTH;
    tempCanvas.height = CANVAS_CONFIG.EXPORT_HEIGHT;
    
    // Draw customer name if provided
    drawCustomerName(tempCtx, CANVAS_CONFIG.EXPORT_WIDTH, CANVAS_CONFIG.EXPORT_HEIGHT, true);
    
    // Draw ingredients
    drawIngredients(tempCtx, CANVAS_CONFIG.EXPORT_WIDTH, CANVAS_CONFIG.EXPORT_HEIGHT, true);
    
    // Return base64 string without the data URL prefix
    return tempCanvas.toDataURL('image/png').split(',')[1];
  };

  // Register the export function with the store
  useEffect(() => {
    setExportedImageBase64Function(generateExportBase64);
    
    // Cleanup function to remove the reference when component unmounts
    return () => {
      setExportedImageBase64Function(null);
    };
  }, [order, setExportedImageBase64Function]);
  const setupCanvas = (canvas: HTMLCanvasElement): CanvasRenderingContext2D | null => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up canvas for high DPI
    const dpr = window.devicePixelRatio || CANVAS_CONFIG.DPR_FALLBACK;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    return ctx;
  };

  const drawTShirtBackground = async (ctx: CanvasRenderingContext2D, rect: DOMRect): Promise<void> => {
    try {
      const tshirtImg = new Image();
      tshirtImg.crossOrigin = 'anonymous';
      tshirtImg.src = '/Comfort_Colors_1717_White_Front_High.png';
      
      await new Promise<void>((resolve, reject) => {
        tshirtImg.onload = () => resolve();
        tshirtImg.onerror = reject;
      });
      
      // Scale t-shirt to fit canvas while maintaining aspect ratio
      const tshirtAspect = tshirtImg.width / tshirtImg.height;
      const canvasAspect = rect.width / rect.height;
      
      let tshirtWidth: number, tshirtHeight: number;
      if (tshirtAspect > canvasAspect) {
        tshirtWidth = rect.width;
        tshirtHeight = rect.width / tshirtAspect;
      } else {
        tshirtHeight = rect.height;
        tshirtWidth = rect.height * tshirtAspect;
      }
      
      const tshirtX = (rect.width - tshirtWidth) / 2;
      const tshirtY = (rect.height - tshirtHeight) / 2;
      
      ctx.drawImage(tshirtImg, tshirtX, tshirtY, tshirtWidth, tshirtHeight);
    } catch (error) {
      console.error('Failed to load t-shirt image:', error);
      // Fallback: white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);
    }
  };

  const drawCustomerName = (ctx: CanvasRenderingContext2D, width: number, height: number, isExport: boolean): void => {
    if (!order.customerName) return;

    const nameFontSize = isExport 
      ? width * 0.04 
      : Math.max(18, Math.min(22, width * 0.035));
    
    ctx.font = `${FONT_CONFIG.WEIGHT} ${nameFontSize}px ${FONT_CONFIG.FAMILY}`;
    ctx.fillStyle = order.nameColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const nameY = height * (isExport ? POSITION_CONFIG.EXPORT_NAME_Y_PERCENT : POSITION_CONFIG.NAME_Y_PERCENT);
    ctx.fillText(`${order.customerName}'s Bagel Order`, width / 2, nameY);
  };

  const getIngredientNames = () => ({
    meat: {
      'ham': 'Ham',
      'sausage': 'Sausage',
      'bacon': 'Bacon',
      'turkey': 'Turkey',
      'lox': 'Lox'
    },
    egg: {
      'egg': 'Egg',
      'scrambled': 'Scrambled Eggs',
      'fried': 'Fried Egg',
      'over-easy': 'Over Easy Egg'
    },
    cheese: {
      'american': 'American Cheese',
      'swiss': 'Swiss Cheese',
      'cheddar': 'Cheddar Cheese',
      'pepper-jack': 'Pepper Jack Cheese'
    },
    veggie: {
      'red-onion': 'Red Onion',
      'lettuce': 'Lettuce',
      'tomato': 'Tomato',
      'jalapenos': 'Jalapeños',
      'avocado': 'Avocado',
      'cucumber': 'Cucumber',
      'pickles': 'Pickles',
      'capers': 'Capers'
    },
    condiment: {
      'salt': 'Salt',
      'pepper': 'Pepper',
      'ketchup': 'Ketchup',
      'mayo': 'Mayo'
    },
    shmear: {
      'plain-cream-cheese': 'Cream Cheese',
      'scallion': 'Scallion\nCream Cheese',
      'tofu': 'Tofu\nCream Cheese',
      'strawberry': 'Strawberry\nCream Cheese',
      'garlic-herb': 'Garlic Herb\nCream Cheese',
      'butter': 'Butter',
      'peanut-butter': 'Peanut Butter'
    },
    base: {
      'plain': 'Bagel',
      'sesame': 'Sesame',
      'raisin': 'Raisin',
      'everything': 'Everything',
      'whole-wheat': 'Whole Wheat'
    }
  });

  const collectIngredients = (): Ingredient[] => {
    const allIngredients: Ingredient[] = [];
    const names = getIngredientNames();
    
    // Collect all toppings first (meat, egg, cheese, veggies, shmear)
    
    // 1. Meat
    if (order.meat) {
      allIngredients.push({ 
        name: names.meat[order.meat], 
        color: INGREDIENT_COLORS[order.meat] || '#666666'
      });
    }
    
    // 2. Eggs
    if (order.egg) {
      allIngredients.push({ 
        name: names.egg[order.egg], 
        color: INGREDIENT_COLORS[order.egg] || '#666666'
      });
    }
    
    // 3. Cheese
    if (order.cheese) {
      let cheeseName = names.cheese[order.cheese];
      
      // Add line break if cheese name is 13+ characters
      if (cheeseName.length >= 13) {
        cheeseName = cheeseName.replace(' Cheese', '\nCheese');
      }
      
      allIngredients.push({ 
        name: cheeseName, 
        color: INGREDIENT_COLORS[order.cheese] || '#666666'
      });
    }
    
    // 4. Veggies
    order.veggies.forEach(veggie => {
      allIngredients.push({ 
        name: names.veggie[veggie], 
        color: INGREDIENT_COLORS[veggie] || '#666666'
      });
    });
    
    // 5. Condiments
    order.condiments.forEach(condiment => {
      allIngredients.push({ 
        name: names.condiment[condiment], 
        color: INGREDIENT_COLORS[condiment] || '#666666'
      });
    });
    
    // 6. Add shmear
    if (order.shmear !== 'none') {
      allIngredients.push({ 
        name: names.shmear[order.shmear], 
        color: INGREDIENT_COLORS[order.shmear] || '#666666'
      });
    }
    
    // Add ampersands to all ingredients except the last one
    allIngredients.forEach((ingredient, index) => {
      ingredient.addAmpersand = index < allIngredients.length - 1;
    });
    
    // 7. Add bagel text
    const hasOtherIngredients = allIngredients.length > 0;
    const bagelText = generateBagelText(hasOtherIngredients);
    
    allIngredients.push({
      name: bagelText,
      color: INGREDIENT_COLORS[order.base] || '#8B4513',
      isBagelLine: true
    });
    
    return allIngredients;
  };

  const generateBagelText = (hasOtherIngredients: boolean): string => {
    const names = getIngredientNames();
    const baseName = names.base[order.base];
    
    const getCorrectArticle = (word: string): string => {
      const vowelSounds = ['a', 'e', 'i', 'o', 'u'];
      const firstLetter = word.toLowerCase().charAt(0);
      return vowelSounds.includes(firstLetter) ? 'an' : 'a';
    };

    if (hasOtherIngredients) {
      if (order.base === 'plain') {
        return order.toasted ? `on a\nToasted Bagel` : `on a Bagel`;
      } else {
        if (order.toasted) {
          if (order.base === 'whole-wheat') {
            return `on a Toasted\nWhole Wheat Bagel`;
          } else if (order.base === 'everything') {
            return `on a Toasted\nEverything Bagel`;
          } else {
            return `on a Toasted\n${baseName} Bagel`;
          }
        } else {
          if (order.base === 'whole-wheat') {
            return `on a\nWhole Wheat Bagel`;
          } else if (order.base === 'everything') {
            return `on an\nEverything Bagel`;
          } else {
            return `on a\n${baseName} Bagel`;
          }
        }
      }
    } else {
      if (order.toasted) {
        if (order.base === 'plain') {
          return 'Toasted Bagel';
        } else if (order.base === 'whole-wheat') {
          return 'Toasted\nWhole Wheat Bagel';
        } else if (order.base === 'everything') {
          return 'Toasted\nEverything Bagel';
        } else {
          return `Toasted\n${baseName} Bagel`;
        }
      } else {
        if (order.base === 'whole-wheat') {
          return 'Whole Wheat Bagel';
        } else if (order.base === 'everything') {
          return 'Everything Bagel';
        } else if (order.base === 'plain') {
          return 'Bagel';
        } else {
          return `${baseName} Bagel`;
        }
      }
    }
  };

  const calculateFontSize = (ingredients: Ingredient[], width: number, height: number, isExport: boolean): { fontSize: number; lineHeight: number; startY: number } => {
    const hasMultipleIngredients = ingredients.length > 1;
    const hasName = order.customerName;
    
    let fontSize: number;
    let startY: number;
    
    if (isExport) {
      startY = hasName ? height * POSITION_CONFIG.EXPORT_START_Y_WITH_NAME : height * POSITION_CONFIG.EXPORT_START_Y_WITHOUT_NAME;
      
      let baseFontSize = SIZING_CONFIG.BASE_EXPORT_SIZE;
      
      // Apply bagel-specific size adjustments
      if (order.base === 'everything' || order.base === 'whole-wheat') {
        baseFontSize *= SIZING_CONFIG.EVERYTHING_WHOLE_WHEAT_SCALE;
      } else if (order.base === 'sesame') {
        baseFontSize *= SIZING_CONFIG.SESAME_SCALE;
      }
      
      fontSize = baseFontSize;
      
      // Apply scaling based on ingredient count
      if (hasMultipleIngredients) {
        fontSize *= SIZING_CONFIG.MULTIPLE_INGREDIENTS_SCALE;
      } else if (order.base === 'everything') {
        fontSize *= SIZING_CONFIG.EVERYTHING_ALONE_SCALE;
      }
    } else {
      // Preview settings
      let basePreviewSize = Math.max(
        SIZING_CONFIG.MIN_BASE_PREVIEW_SIZE, 
        Math.min(SIZING_CONFIG.MAX_PREVIEW_SIZE, (width / SIZING_CONFIG.REFERENCE_WIDTH) * 28)
      );
      
      // Apply bagel-specific size adjustments
      if (order.base === 'everything' || order.base === 'whole-wheat') {
        basePreviewSize *= SIZING_CONFIG.EVERYTHING_WHOLE_WHEAT_SCALE;
      } else if (order.base === 'sesame') {
        basePreviewSize *= SIZING_CONFIG.SESAME_SCALE;
      }
      
      fontSize = basePreviewSize;
      
      // Apply scaling based on ingredient count
      if (hasMultipleIngredients) {
        fontSize *= SIZING_CONFIG.MULTIPLE_INGREDIENTS_SCALE;
      } else if (order.base === 'everything') {
        fontSize *= SIZING_CONFIG.EVERYTHING_ALONE_SCALE;
      }
      
      startY = hasName
        ? (ingredients.length <= 2 
            ? height * POSITION_CONFIG.PREVIEW_START_Y_FEW_INGREDIENTS_WITH_NAME 
            : height * POSITION_CONFIG.PREVIEW_START_Y_MANY_INGREDIENTS_WITH_NAME)
        : (ingredients.length <= 2 
            ? height * POSITION_CONFIG.PREVIEW_START_Y_FEW_INGREDIENTS_WITHOUT_NAME 
            : height * POSITION_CONFIG.PREVIEW_START_Y_MANY_INGREDIENTS_WITHOUT_NAME);
    }
    
    let lineHeight = fontSize * FONT_CONFIG.LINE_HEIGHT_MULTIPLIER;
    
    // Check if content fits and adjust if necessary
    const maxY = isExport ? height * POSITION_CONFIG.MAX_Y_EXPORT : height * POSITION_CONFIG.MAX_Y_PREVIEW;
    const availableHeight = isExport ? height * POSITION_CONFIG.MAX_TEXT_HEIGHT_EXPORT : maxY - startY;
    
    // Calculate total height needed
    let totalHeight = 0;
    ingredients.forEach(ingredient => {
      if (ingredient.name.includes('\n')) {
        totalHeight += ingredient.name.split('\n').length * lineHeight;
      } else {
        totalHeight += lineHeight;
      }
    });
    
    // Scale down if content doesn't fit
    if (totalHeight > availableHeight) {
      const scaleFactor = availableHeight / totalHeight;
      const minSize = isExport ? SIZING_CONFIG.MIN_EXPORT_SIZE : SIZING_CONFIG.MIN_PREVIEW_SIZE;
      fontSize = Math.max(minSize, fontSize * scaleFactor);
      lineHeight = fontSize * (isExport ? FONT_CONFIG.LINE_HEIGHT_MULTIPLIER : FONT_CONFIG.TIGHT_LINE_HEIGHT_MULTIPLIER);
    }
    
    return { fontSize, lineHeight, startY };
  };

  const needsStroke = (ingredientName: string): boolean => {
    return ingredientName.includes('Cream Cheese') && 
           (ingredientName.includes('Cream Cheese') || ingredientName.includes('Tofu'));
  };

  const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string, addStroke: boolean): void => {
    if (addStroke) {
      ctx.strokeStyle = STROKE_CONFIG.COLOR;
      ctx.lineWidth = STROKE_CONFIG.WIDTH;
      ctx.strokeText(text, x, y);
    }
    
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
  };

  const drawIngredients = (ctx: CanvasRenderingContext2D, width: number, height: number, isExport: boolean): void => {
    const ingredients = collectIngredients();
    if (ingredients.length === 0) return;
    
    const { fontSize, lineHeight, startY } = calculateFontSize(ingredients, width, height, isExport);
    
    ctx.font = `${FONT_CONFIG.WEIGHT} ${fontSize}px ${FONT_CONFIG.FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const centerX = width / 2;
    const maxY = isExport ? height * POSITION_CONFIG.MAX_Y_EXPORT : height * POSITION_CONFIG.MAX_Y_PREVIEW;
    let currentY = startY;
    
    // Draw each ingredient
    ingredients.forEach((ingredient) => {
      if (currentY > maxY) return;
      
      const displayColor = order.textStyle === 'black' ? '#000000' : ingredient.color;
      const addStroke = needsStroke(ingredient.name);
      
      // Handle multi-line text
      if (ingredient.name.includes('\n')) {
        const lines = ingredient.name.split('\n');
        lines.forEach((line, lineIndex) => {
          if (currentY + (lineIndex * lineHeight) <= maxY) {
            const displayText = ingredient.addAmpersand && lineIndex === lines.length - 1 ? `${line} &` : line;
            drawText(ctx, displayText, centerX, currentY + (lineIndex * lineHeight), displayColor, addStroke);
          }
        });
        currentY += lines.length * lineHeight;
      } else {
        // Single line text
        const displayText = ingredient.addAmpersand ? `${ingredient.name} &` : ingredient.name;
        drawText(ctx, displayText, centerX, currentY, displayColor, addStroke);
        currentY += lineHeight;
      }
    });
  };

  const drawBagel = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): Promise<void> => {
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    
    // Draw t-shirt background
    await drawTShirtBackground(ctx, rect);
    
    // Draw customer name if provided
    drawCustomerName(ctx, rect.width, rect.height, false);
    
    // Draw ingredients list
    drawIngredients(ctx, rect.width, rect.height, false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = setupCanvas(canvas);
    if (!ctx) return;
    
    drawBagel(ctx, canvas);
  }, [order]);

  const exportPNG = (): void => {
    const base64 = generateExportBase64();
    if (!base64) return;
    
    // Create download link
    const dataURL = `data:image/png;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = dataURL;
    downloadLink.download = `bagel-order-${order.customerName || 'custom'}-${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full border border-gray-200 rounded-lg bg-gray-50"
        style={{ 
          aspectRatio: CANVAS_CONFIG.ASPECT_RATIO, 
          minHeight: CANVAS_CONFIG.MIN_HEIGHT, 
          maxHeight: CANVAS_CONFIG.MAX_HEIGHT 
        }}
      />
      <button
        onClick={exportPNG}
        className="absolute top-2 right-2 bg-blue-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm hover:bg-blue-600 transition-colors"
      >
        Export PNG
      </button>
    </div>
  );
};