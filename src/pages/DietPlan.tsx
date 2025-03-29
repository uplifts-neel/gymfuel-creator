
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserRound, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import NavigationBar from '@/components/NavigationBar';
import Header from '@/components/Header';

interface Member {
  id: string;
  name: string;
  admission_number: string;
  phone: string;
}

const DietPlan = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMembers(members);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = members.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.admission_number.includes(query) ||
          member.phone.includes(query)
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, name, admission_number, phone')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      setMembers(data || []);
      setFilteredMembers(data || []);
    } catch (error) {
      console.error('Error in fetchMembers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load members',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDietPlan = (memberId: string) => {
    navigate(`/create-diet-plan/${memberId}`);
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
          <h1 className="text-xl font-semibold">Create Diet Plan</h1>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, admission number or phone"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <Card 
                key={member.id}
                className="p-4 hover:bg-muted/20 transition-colors cursor-pointer animate-fade-in"
                onClick={() => handleCreateDietPlan(member.id)}
              >
                <CardContent className="p-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <UserRound size={20} className="text-coral" />
                    </div>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <div className="flex text-sm text-muted-foreground">
                        <span>#{member.admission_number}</span>
                        <span className="mx-1">•</span>
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    Select
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No members found</p>
              <Button 
                onClick={() => navigate('/new-member')}
                className="bg-coral hover:bg-coral/90"
              >
                Register New Member
              </Button>
            </div>
          )}
        </div>
      </main>

      <NavigationBar />
    </div>
  );
};

export default DietPlan;
