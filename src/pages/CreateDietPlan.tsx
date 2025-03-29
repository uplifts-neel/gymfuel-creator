
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';

interface Member {
  id: string;
  name: string;
  admission_number: string;
  phone: string;
}

interface Meal {
  id: string;
  time_slot: 'morning' | 'afternoon' | 'evening' | 'night';
  name: string;
  category: string;
  quantity: string;
}

const CreateDietPlan = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (memberId) {
      fetchMember(memberId);
    }
  }, [memberId]);

  const fetchMember = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, name, admission_number, phone')
        .eq('id', id)
        .single();

      if (error) throw error;
      setMember(data);
      
      // Initialize with some empty meals
      setMeals([
        { id: 'temp-1', time_slot: 'morning', name: '', category: 'Protein', quantity: '' },
        { id: 'temp-2', time_slot: 'afternoon', name: '', category: 'Carbs', quantity: '' },
        { id: 'temp-3', time_slot: 'evening', name: '', category: 'Fruits', quantity: '' }
      ]);
    } catch (error) {
      console.error('Error fetching member:', error);
      toast({
        title: 'Error',
        description: 'Failed to load member details',
        variant: 'destructive',
      });
      navigate('/diet-plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMeal = () => {
    const newId = `temp-${Date.now()}`;
    setMeals([...meals, { id: newId, time_slot: 'morning', name: '', category: 'Protein', quantity: '' }]);
  };

  const handleRemoveMeal = (id: string) => {
    setMeals(meals.filter(meal => meal.id !== id));
  };

  const handleMealChange = (id: string, field: keyof Meal, value: string) => {
    setMeals(meals.map(meal => 
      meal.id === id ? { ...meal, [field]: value } : meal
    ));
  };

  const saveDietPlan = async () => {
    if (!member || !user) {
      toast({
        title: 'Error',
        description: 'Member details or user authentication missing',
        variant: 'destructive',
      });
      return;
    }
    
    // Validate meals
    const invalidMeals = meals.filter(meal => !meal.name || !meal.quantity);
    if (invalidMeals.length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all meal details',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // First create the diet plan
      const { data: dietPlan, error: dietPlanError } = await supabase
        .from('diet_plans')
        .insert([
          {
            member_id: member.id,
            date: new Date().toISOString().split('T')[0],
            created_by: user.id
          }
        ])
        .select()
        .single();
      
      if (dietPlanError) throw dietPlanError;
      
      // Then add all the meals
      const mealsToInsert = meals.map(meal => ({
        diet_plan_id: dietPlan.id,
        time_slot: meal.time_slot,
        name: meal.name,
        category: meal.category,
        quantity: meal.quantity
      }));
      
      const { error: mealsError } = await supabase
        .from('diet_meals')
        .insert(mealsToInsert);
      
      if (mealsError) throw mealsError;
      
      toast({
        title: 'Success',
        description: `Diet plan created for ${member.name}`,
      });
      
      navigate('/diet-plan');
    } catch (error) {
      console.error('Error saving diet plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to save diet plan',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <main className="px-4 py-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/diet-plan')}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Create Diet Plan</h1>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : member ? (
          <>
            <Card className="mb-6 animate-fade-in">
              <CardContent className="p-4">
                <div className="flex flex-col space-y-1">
                  <h2 className="text-xl font-semibold">{member.name}</h2>
                  <p className="text-sm text-muted-foreground">#{member.admission_number} · {member.phone}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6 animate-fade-in">
              <CardHeader>
                <CardTitle>Diet Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {meals.map((meal, index) => (
                  <div key={meal.id} className="p-4 border rounded-lg animate-scale-in">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Meal {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMeal(meal.id)}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`time-${meal.id}`}>Time Slot</Label>
                        <Select
                          value={meal.time_slot}
                          onValueChange={(value) => handleMealChange(meal.id, 'time_slot', value as any)}
                        >
                          <SelectTrigger id={`time-${meal.id}`}>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning</SelectItem>
                            <SelectItem value="afternoon">Afternoon</SelectItem>
                            <SelectItem value="evening">Evening</SelectItem>
                            <SelectItem value="night">Night</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor={`name-${meal.id}`}>Meal Name</Label>
                        <Input
                          id={`name-${meal.id}`}
                          value={meal.name}
                          onChange={(e) => handleMealChange(meal.id, 'name', e.target.value)}
                          placeholder="Enter meal name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`category-${meal.id}`}>Category</Label>
                          <Select
                            value={meal.category}
                            onValueChange={(value) => handleMealChange(meal.id, 'category', value)}
                          >
                            <SelectTrigger id={`category-${meal.id}`}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Protein">Protein</SelectItem>
                              <SelectItem value="Carbs">Carbs</SelectItem>
                              <SelectItem value="Fruits">Fruits</SelectItem>
                              <SelectItem value="Vegetables">Vegetables</SelectItem>
                              <SelectItem value="Supplements">Supplements</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`quantity-${meal.id}`}>Quantity</Label>
                          <Input
                            id={`quantity-${meal.id}`}
                            value={meal.quantity}
                            onChange={(e) => handleMealChange(meal.id, 'quantity', e.target.value)}
                            placeholder="e.g. 100g, 2 scoops"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleAddMeal}
                >
                  <Plus size={16} className="mr-2" />
                  Add Another Meal
                </Button>
              </CardContent>
            </Card>
            
            <Button
              className="w-full bg-coral hover:bg-coral/90"
              onClick={saveDietPlan}
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">⟳</span> Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <Check className="mr-2 h-4 w-4" /> Save Diet Plan
                </span>
              )}
            </Button>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Member not found
          </div>
        )}
      </main>

      <NavigationBar />
    </div>
  );
};

export default CreateDietPlan;
