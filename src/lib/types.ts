import type { User, UserInfo } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export type FirebaseUser = User;

export interface MaintenanceEntry {
  id: string;
  date: Timestamp;
  label: string;
  mileage: number;
  price: number;
  garage: string;
  invoiceUrl?: string;
}
