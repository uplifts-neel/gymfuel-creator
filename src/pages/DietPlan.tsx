
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Weight, Check, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

type Step = 'info' | 'meals' | 'review';
type Meal = { id: string; name: string; category: string };
type MealTime = 'morning' | 'afternoon' | 'beforeGym' | 'afterGym' | 'evening' | 'night';

const DietPlan = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [memberInfo, setMemberInfo] = useState({
    admissionNumber: '',
    fullName: '',
    weight: '',
  });
  
  const [selectedMeals, setSelectedMeals] = useState<Record<MealTime, Meal[]>>({
    morning: [],
    afternoon: [],
    beforeGym: [],
    afterGym: [],
    evening: [],
    night: [],
  });

  const [currentMealTime, setCurrentMealTime] = useState<MealTime>('morning');
  
  const mealTimes: { id: MealTime; label: string }[] = [
    { id: 'morning', label: 'Morning' },
    { id: 'afternoon', label: 'Afternoon' },
    { id: 'beforeGym', label: 'Before Gym' },
    { id: 'afterGym', label: 'After Gym' },
    { id: 'evening', label: 'Evening' },
    { id: 'night', label: 'Night' },
  ];

  // Sample meal categories and options
  const mealCategories = [
    { 
      name: 'Proteins', 
      items: [
        { id: 'eggs', name: 'Eggs', category: 'Proteins' },
        { id: 'chicken', name: 'Chicken', category: 'Proteins' },
        { id: 'whey', name: 'Whey Protein', category: 'Proteins' },
        { id: 'fish', name: 'Fish', category: 'Proteins' },
      ]
    },
    { 
      name: 'Carbs', 
      items: [
        { id: 'bread', name: 'Bread', category: 'Carbs' },
        { id: 'chapati', name: 'Chapati', category: 'Carbs' },
        { id: 'rice', name: 'Rice', category: 'Carbs' },
        { id: 'sweetPotato', name: 'Sweet Potato', category: 'Carbs' },
      ]
    },
    { 
      name: 'Dairy', 
      items: [
        { id: 'milk', name: 'Milk', category: 'Dairy' },
        { id: 'curd', name: 'Curd', category: 'Dairy' },
        { id: 'greekYogurt', name: 'Greek Yogurt', category: 'Dairy' },
      ]
    },
    { 
      name: 'Fruits', 
      items: [
        { id: 'apple', name: 'Apple', category: 'Fruits' },
        { id: 'banana', name: 'Banana', category: 'Fruits' },
        { id: 'mixedFruits', name: 'Mixed Fruits', category: 'Fruits' },
      ]
    },
    { 
      name: 'Supplements', 
      items: [
        { id: 'preWorkout', name: 'Pre-Workout', category: 'Supplements' },
        { id: 'eaaBcaa', name: 'EAA & BCAA', category: 'Supplements' },
      ]
    },
    { 
      name: 'Others', 
      items: [
        { id: 'peanutButter', name: 'Peanut Butter', category: 'Others' },
        { id: 'almonds', name: 'Almonds', category: 'Others' },
        { id: 'soyaBean', name: 'Soya Bean', category: 'Others' },
        { id: 'salad', name: 'Salad', category: 'Others' },
      ]
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMemberInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 'info') {
      setCurrentStep('meals');
    } else if (currentStep === 'meals') {
      setCurrentStep('review');
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'meals') {
      setCurrentStep('info');
    } else if (currentStep === 'review') {
      setCurrentStep('meals');
    }
  };

  const handleMealSelect = (meal: Meal) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [currentMealTime]: [...prev[currentMealTime], meal],
    }));
  };

  const handleRemoveMeal = (mealTime: MealTime, mealId: string) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [mealTime]: prev[mealTime].filter((meal) => meal.id !== mealId),
    }));
  };

  const handleGeneratePlan = () => {
    // In a real app, this would generate the plan
    navigate('/history');
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />
      
      <main className="px-4 py-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">
            {currentStep === 'info' && 'Member Information'}
            {currentStep === 'meals' && 'Meal Planning'}
            {currentStep === 'review' && 'Review Diet Plan'}
          </h1>
        </div>
        
        {/* Step 1: Member Information */}
        {currentStep === 'info' && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="admissionNumber">Admission Number</Label>
              <Input
                id="admissionNumber"
                name="admissionNumber"
                placeholder="Enter member's admission number"
                value={memberInfo.admissionNumber}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Enter member's full name"
                value={memberInfo.fullName}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Current Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                placeholder="Enter member's weight"
                value={memberInfo.weight}
                onChange={handleInputChange}
              />
            </div>
            
            <Button 
              onClick={handleNextStep}
              className="w-full mt-4 bg-coral hover:bg-coral/90"
              disabled={!memberInfo.admissionNumber || !memberInfo.fullName || !memberInfo.weight}
            >
              Next
            </Button>
          </div>
        )}
        
        {/* Step 2: Meal Planning */}
        {currentStep === 'meals' && (
          <div className="space-y-6 animate-fade-in">
            <div className="overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {mealTimes.map((time) => (
                  <Button
                    key={time.id}
                    variant={currentMealTime === time.id ? "default" : "outline"}
                    onClick={() => setCurrentMealTime(time.id)}
                    className={currentMealTime === time.id ? "bg-coral" : ""}
                  >
                    {time.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">
                Selected for {mealTimes.find(t => t.id === currentMealTime)?.label}:
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMeals[currentMealTime].length > 0 ? (
                  selectedMeals[currentMealTime].map((meal) => (
                    <div 
                      key={meal.id} 
                      className="flex items-center gap-1 px-3 py-1 bg-turquoise text-white rounded-full text-sm animate-scale-in"
                    >
                      {meal.name}
                      <button 
                        onClick={() => handleRemoveMeal(currentMealTime, meal.id)}
                        className="ml-1 text-white/80 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No meals selected</p>
                )}
              </div>
              
              <div className="space-y-6">
                {mealCategories.map((category) => (
                  <div key={category.name} className="animate-slide-in">
                    <h4 className="text-md font-medium mb-2 text-coral">{category.name}</h4>
                    <div className="overflow-x-auto">
                      <div className="flex gap-2 pb-2">
                        {category.items.map((meal) => (
                          <Button
                            key={meal.id}
                            variant="outline"
                            onClick={() => handleMealSelect(meal)}
                            className="whitespace-nowrap hover:bg-turquoise hover:text-white transition-colors"
                          >
                            {meal.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleNextStep}
                className="flex-1 bg-coral hover:bg-coral/90"
              >
                Review Plan
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6 animate-fade-in">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User size={24} className="text-coral" />
                </div>
                <div>
                  <h3 className="font-medium">{memberInfo.fullName}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-3">#{memberInfo.admissionNumber}</span>
                    <Weight size={14} className="mr-1" />
                    <span>{memberInfo.weight} kg</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {mealTimes.map((time) => (
                  <div key={time.id} className="border-t pt-3">
                    <h4 className="font-medium text-coral mb-2">{time.label}</h4>
                    {selectedMeals[time.id].length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedMeals[time.id].map((meal) => (
                          <div 
                            key={meal.id} 
                            className="flex items-center gap-1 px-3 py-1 bg-card border border-border rounded-full text-sm"
                          >
                            {meal.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No meals selected</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePrevStep}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleGeneratePlan}
                className="flex-1 bg-turquoise hover:bg-turquoise/90 animate-pulse-glow"
              >
                <Check size={16} className="mr-2" />
                Generate Plan
              </Button>
            </div>
            
            <Button 
              variant="secondary"
              className="w-full bg-coral/10 hover:bg-coral/20 text-coral"
            >
              <Share2 size={16} className="mr-2" />
              Share Plan
            </Button>
          </div>
        )}
      </main>

      <NavigationBar />
    </div>
  );
};

export default DietPlan;
