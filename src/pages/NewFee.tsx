
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Calendar, UserRound, SearchIcon } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Header from '@/components/Header';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Member {
  id: string;
  name: string;
  admission_number: string;
  phone: string;
}

const feeSchema = z.object({
  admissionNumber: z.string().min(1, { message: 'Admission number is required' }),
  amount: z.string().min(1, { message: 'Amount is required' }),
  paymentDate: z.date({ required_error: "Payment date is required" }),
  dueDate: z.date({ required_error: "Due date is required" }),
  status: z.enum(['Paid', 'Due'], { required_error: "Status is required" }),
});

type FeeFormData = z.infer<typeof feeSchema>;

const NewFee = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const form = useForm<FeeFormData>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      admissionNumber: '',
      amount: '',
      paymentDate: new Date(),
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      status: 'Paid',
    },
  });

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
          member.admission_number.includes(query)
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, name, admission_number, phone')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
      setFilteredMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load members',
        variant: 'destructive',
      });
    }
  };

  const selectMember = (member: Member) => {
    setSelectedMember(member);
    form.setValue('admissionNumber', member.admission_number);
    setShowMemberSearch(false);
  };

  const onSubmit = async (values: FeeFormData) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to add fees",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedMember) {
      toast({
        title: "Error",
        description: "Please select a valid member",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('fees')
        .insert([
          {
            member_id: selectedMember.id,
            amount_paid: parseFloat(values.amount),
            payment_date: values.paymentDate.toISOString().split('T')[0],
            due_date: values.dueDate.toISOString().split('T')[0],
            status: values.status,
            created_by: user.id
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Fee added",
        description: `Fee record added successfully for ${selectedMember.name}`,
      });
      
      // Navigate back to fees page
      navigate('/fees');
      
    } catch (error) {
      console.error('Error adding fee record:', error);
      toast({
        title: "Error",
        description: "Failed to add fee record",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
            onClick={() => navigate('/fees')}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-semibold">Add New Fee</h1>
        </div>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 text-coral" size={20} />
              New Fee Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="admissionNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Member</FormLabel>
                        <div className="flex">
                          <FormControl>
                            <div className="relative flex-grow">
                              <Input 
                                {...field}
                                placeholder="Search by admission number" 
                                readOnly
                                onClick={() => setShowMemberSearch(true)}
                                value={selectedMember ? `${selectedMember.admission_number} - ${selectedMember.name}` : field.value}
                                className="pr-10"
                              />
                              <SearchIcon 
                                size={18} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
                                onClick={() => setShowMemberSearch(true)}
                              />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {showMemberSearch && (
                    <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg">
                      <div className="p-2">
                        <Input
                          placeholder="Search members..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredMembers.length > 0 ? (
                          filteredMembers.map((member) => (
                            <div
                              key={member.id}
                              className="p-2 hover:bg-muted cursor-pointer flex items-center"
                              onClick={() => selectMember(member)}
                            >
                              <UserRound size={16} className="mr-2 text-muted-foreground" />
                              <div>
                                <div>{member.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  #{member.admission_number} · {member.phone}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-muted-foreground">
                            No members found
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => setShowMemberSearch(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Enter amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Payment Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <Calendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Due">Due</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-coral hover:bg-coral/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Fee Record'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NewFee;
