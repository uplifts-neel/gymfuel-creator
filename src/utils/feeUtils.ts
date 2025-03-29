
import { FeeRecord } from "@/components/fees/FeeCard";

export const getPaidRecords = (records: FeeRecord[]) => {
  return records.filter((record) => record.status === 'Paid');
};

export const getDueRecords = (records: FeeRecord[]) => {
  return records.filter((record) => record.status === 'Due');
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
