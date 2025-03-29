
import { useState, useEffect } from 'react';
import { ArrowLeft, Search, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FeeCard, { FeeRecord } from '@/components/fees/FeeCard';
import { getPaidRecords, getDueRecords } from '@/utils/feeUtils';

const Fees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeeRecords();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecords(feeRecords);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = feeRecords.filter(
        (record) =>
          record.member.name.toLowerCase().includes(query) ||
          record.member.admission_number.includes(query)
      );
      setFilteredRecords(filtered);
    }
  }, [searchQuery, feeRecords]);

  const fetchFeeRecords = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('fees')
        .select(`
          id,
          member_id,
          amount_paid,
          payment_date,
          due_date,
          status,
          member:members(name, admission_number, phone)
        `)
        .order('due_date', { ascending: false });

      if (error) {
        console.error('Error fetching fees:', error);
        throw error;
      }

      // Type assertion to ensure the data matches our FeeRecord type
      const typedData = (data || []) as FeeRecord[];
      setFeeRecords(typedData);
      setFilteredRecords(typedData);
    } catch (error) {
      console.error('Error in fetchFeeRecords:', error);
      toast({
        title: 'Error',
        description: 'Failed to load fee records',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewFee = () => {
    navigate('/new-fee');
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <main className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Fee Management</h1>
          </div>
          
          {user?.role === 'owner' && (
            <Button 
              onClick={handleAddNewFee}
              className="bg-coral hover:bg-coral/90"
            >
              <PlusCircle size={16} className="mr-1" />
              New Fee
            </Button>
          )}
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

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="due">Due</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <FeeCard key={record.id} record={record} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No fee records found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="paid" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : getPaidRecords(filteredRecords).length > 0 ? (
              getPaidRecords(filteredRecords).map((record) => (
                <FeeCard key={record.id} record={record} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No paid records found
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="due" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : getDueRecords(filteredRecords).length > 0 ? (
              getDueRecords(filteredRecords).map((record) => (
                <FeeCard key={record.id} record={record} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No due records found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <NavigationBar />
    </div>
  );
};

export default Fees;
