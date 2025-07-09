import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StepIndicator } from './components/StepIndicator';
import { BaseSelector } from './components/BaseSelector';
import { ShmearSelector } from './components/ShmearSelector';
import { ToppingsSelector } from './components/ToppingsSelector';
import { NameCustomizer } from './components/NameCustomizer';
import { OrderSummary } from './components/OrderSummary';
import { BagelCanvas } from './components/BagelCanvas';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const totalSteps = 5;

  const steps = [
    { component: BaseSelector, title: 'Base' },
    { component: ShmearSelector, title: 'Shmear' },
    { component: ToppingsSelector, title: 'Toppings' },
    { component: NameCustomizer, title: 'Customize' },
    { component: OrderSummary, title: 'Summary' },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Build-a-Bagel T-shirt Maker</h1>
          <p className="text-gray-600">Print your favorite bagel order on a tee!</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Mobile: Preview on top (larger), Desktop: Side by side */}
          <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-6">
            {/* Preview Panel - Shows first on mobile */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 lg:mb-0 lg:order-2 lg:col-span-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:mb-4">Live Preview</h3>
              <BagelCanvas className="w-full" />
            </div>

            {/* Form Panel - Shows second on mobile */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:order-1 lg:col-span-2">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">
                  Step {currentStep}: {steps[currentStep - 1].title}
                </h2>
                <div className="flex items-center space-x-1 mt-2">
                  {Array.from({ length: totalSteps }, (_, index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded ${
                        index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <CurrentStepComponent />
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
                  <span>Previous</span>
                </button>

                {currentStep < totalSteps && (
                  <button
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;