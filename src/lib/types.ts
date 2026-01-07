import type { User } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';

export type FirebaseUser = User;

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  licensePlate: string;
}

export interface MaintenanceEntry {
  id: string;
  vehicleId: string; // Keep track of which vehicle this belongs to
  date: Timestamp;
  label: string;
  mileage: number;
  price: number;
  garage: string;
  invoiceUrl?: string;
}
