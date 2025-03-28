
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, User, Calendar, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import NavigationBar from '@/components/NavigationBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface MemberPlan {
  id: string;
  name: string;
  admissionNumber: string;
  date: string;
  weight: string;
}

const History = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data
  const memberPlans: MemberPlan[] = [
    {
      id: '1',
      name: 'Rahul Kumar',
      admissionNumber: '2023001',
      date: '2023-10-15',
      weight: '75',
    },
    {
      id: '2',
      name: 'Priya Singh',
      admissionNumber: '2023005',
      date: '2023-10-12',
      weight: '62',
    },
    {
      id: '3',
      name: 'Amit Sharma',
      admissionNumber: '2023010',
      date: '2023-10-10',
      weight: '80',
    },
  ];
  
  const filteredPlans = memberPlans.filter(
    (plan) =>
      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.admissionNumber.includes(searchQuery)
  );

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
          <h1 className="text-xl font-semibold">Diet Plan History</h1>
        </div>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name or admission number"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-4">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <Card 
                key={plan.id}
                className="p-4 hover:bg-muted/20 transition-colors cursor-pointer animate-fade-in"
                onClick={() => {
                  // In a real app, this would navigate to the plan details
                  console.log('View plan', plan.id);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <User size={20} className="text-coral" />
                    </div>
                    <div>
                      <h3 className="font-medium">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">#{plan.admissionNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex items-center mr-2 text-sm text-muted-foreground">
                      <Calendar size={14} className="mr-1" />
                      <span>{new Date(plan.date).toLocaleDateString()}</span>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No plans found</p>
            </div>
          )}
        </div>
      </main>

      <NavigationBar />
    </div>
  );
};

export default History;
