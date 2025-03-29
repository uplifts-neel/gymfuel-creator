
import { useState, useEffect } from 'react';
import { ArrowLeft, Search, PlusCircle, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import NavigationBar from '@/components/NavigationBar';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FeeRecord {
  id: string;
  member_id: string;
  amount_paid: number;
  payment_date: string;
  due_date: string;
  status: 'Paid' | 'Due';
  member: {
    name: string;
    admission_number: string;
    phone: string;
  };
}

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

  const getPaidRecords = () => {
    return filteredRecords.filter((record) => record.status === 'Paid');
  };

  const getDueRecords = () => {
    return filteredRecords.filter((record) => record.status === 'Due');
  };

  const handleAddNewFee = () => {
    navigate('/new-fee');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
            ) : getPaidRecords().length > 0 ? (
              getPaidRecords().map((record) => (
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
            ) : getDueRecords().length > 0 ? (
              getDueRecords().map((record) => (
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

interface FeeCardProps {
  record: FeeRecord;
}

const FeeCard = ({ record }: FeeCardProps) => {
  const isPastDue = new Date(record.due_date) < new Date() && record.status === 'Due';
  
  return (
    <Card className="animate-fade-in">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{record.member.name}</h3>
              <p className="text-sm text-muted-foreground">#{record.member.admission_number}</p>
            </div>
            <Badge 
              className={`${
                record.status === 'Paid' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : isPastDue 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              {record.status === 'Paid' ? (
                <span className="flex items-center">
                  <CheckCircle2 size={14} className="mr-1" />
                  Paid
                </span>
              ) : isPastDue ? (
                <span className="flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  Overdue
                </span>
              ) : (
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Due
                </span>
              )}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Amount</p>
              <p className="font-medium">₹{record.amount_paid}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Date</p>
              <p className="font-medium">{new Date(record.payment_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className={`font-medium ${isPastDue ? 'text-red-500' : ''}`}>
                {new Date(record.due_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Contact</p>
              <p className="font-medium">{record.member.phone}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Fees;
