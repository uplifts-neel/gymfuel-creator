
import { AlertCircle, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface FeeRecord {
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

export default FeeCard;
