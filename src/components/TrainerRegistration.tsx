
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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

const trainerSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type TrainerFormData = z.infer<typeof trainerSchema>;

const TrainerRegistration = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TrainerFormData>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  });

  const onSubmit = async (values: TrainerFormData) => {
    setIsLoading(true);
    
    try {
      const success = await register({
        username: values.username,
        password: values.password,
        name: values.name,
        role: 'trainer'
      });
      
      if (success) {
        // Reset form
        form.reset();
        
        // Navigate back
        navigate('/settings');
      }
    } catch (error) {
      console.error('Error in trainer registration:', error);
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
          onClick={() => navigate('/settings')}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-semibold">New Trainer Registration</h1>
      </div>
      
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 text-coral" size={20} />
            Register New Trainer
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
                      <Input placeholder="Enter trainer's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-coral hover:bg-coral/90"
                disabled={isLoading}
              >
                {isLoading ? 'Registering...' : 'Register Trainer'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerRegistration;
