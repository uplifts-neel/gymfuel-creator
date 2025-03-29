
import React, { useState } from 'react';
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
import { ArrowLeft, UserPlus } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const memberSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone: z.string().min(10, { message: 'Enter a valid phone number' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  gymPlan: z.enum(['PT', 'Non-PT'], { 
    required_error: "Please select a gym plan",
  }),
});

type MemberFormData = z.infer<typeof memberSchema>;

const MemberRegistration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      gymPlan: 'Non-PT',
    },
  });

  const onSubmit = async (values: MemberFormData) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to register members",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate admission number (current year + random 3 digit number)
      const year = new Date().getFullYear();
      const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit number
      const admissionNumber = `${year}${randomNum}`;
      
      const { data, error } = await supabase
        .from('members')
        .insert([
          {
            admission_number: admissionNumber,
            name: values.name,
            phone: values.phone,
            address: values.address,
            gym_plan: values.gymPlan,
            created_by: user.id
          }
        ])
        .select()
        .single();
      
      if (error) {
        console.error('Error registering member:', error);
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Member registered",
        description: `${values.name} has been registered with Admission #${admissionNumber}`,
      });
      
      // Reset form
      form.reset();
      
      // Navigate back
      navigate('/');
      
    } catch (error) {
      console.error('Error in member registration:', error);
      toast({
        title: "Registration error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">New Member Registration</h1>
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 text-coral" size={20} />
            Register New Member
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter member's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="gymPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gym Plan</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a plan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PT">Personal Training (PT)</SelectItem>
                        <SelectItem value="Non-PT">Regular (Non-PT)</SelectItem>
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
                {isLoading ? 'Registering...' : 'Register Member'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberRegistration;
