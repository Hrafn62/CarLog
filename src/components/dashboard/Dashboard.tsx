"use client";

import { useState, useEffect, useMemo } from 'react';
import type { FirebaseUser, MaintenanceEntry } from '@/lib/types';
import Header from '@/components/shared/Header';
import Summary from './Summary';
import MaintenanceLog from '../maintenance/MaintenanceLog';
import MaintenanceForm from '../maintenance/MaintenanceForm';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';

export default function Dashboard({ user }: { user: FirebaseUser }) {
  const [maintenanceEntries, setMaintenanceEntries] = useState<MaintenanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, `users/${user.uid}/maintenance`), orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const entries: MaintenanceEntry[] = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as MaintenanceEntry);
      });
      setMaintenanceEntries(entries);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching maintenance entries:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const { totalCost, lastMileage } = useMemo(() => {
    const totalCost = maintenanceEntries.reduce((acc, entry) => acc + entry.price, 0);
    const lastMileage = maintenanceEntries.length > 0 ? maintenanceEntries[0].mileage : 0;
    return { totalCost, lastMileage };
  }, [maintenanceEntries]);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto p-4 md:p-8">
        <Summary totalCost={totalCost} lastMileage={lastMileage} loading={loading} />
        
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold font-headline">Maintenance Log</h2>
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Entry
            </Button>
            <MaintenanceForm user={user} isOpen={isFormOpen} setIsOpen={setIsFormOpen} />
          </div>
          {loading ? (
             <div className="w-full space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
          ) : (
            <MaintenanceLog entries={maintenanceEntries} />
          )}
        </div>
      </main>
    </div>
  );
}
