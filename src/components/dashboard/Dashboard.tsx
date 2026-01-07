"use client";

import { useState, useMemo } from 'react';
import type { FirebaseUser, MaintenanceEntry, Vehicle } from '@/lib/types';
import Header from '@/components/shared/Header';
import Summary from './Summary';
import MaintenanceLog from '../maintenance/MaintenanceLog';
import MaintenanceForm from '../maintenance/MaintenanceForm';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { PlusCircle } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import VehicleSelector from './VehicleSelector';
import AddVehicleForm from './AddVehicleForm';

const mockVehicles: Vehicle[] = [
  { id: 'veh-1', name: 'Ma Peugeot 208', brand: 'Peugeot', model: '208', year: 2019, mileage: 150200 },
  { id: 'veh-2', name: 'La Renault Clio de maman', brand: 'Renault', model: 'Clio IV', year: 2017, mileage: 85400 },
];

const mockEntries: MaintenanceEntry[] = [
    // Vehicle 1
    { id: '1', vehicleId: 'veh-1', date: Timestamp.fromDate(new Date('2023-10-28')), label: 'Vidange moteur', mileage: 150200, price: 120, garage: 'Garage du Centre' },
    { id: '2', vehicleId: 'veh-1', date: Timestamp.fromDate(new Date('2023-08-15')), label: 'Changement pneus avant', mileage: 145500, price: 350, garage: 'AutoPneu', invoiceUrl: '#' },
    { id: '3', vehicleId: 'veh-1', date: Timestamp.fromDate(new Date('2023-05-02')), label: 'Révision annuelle', mileage: 140100, price: 250, garage: 'Garage du Centre' },
    // Vehicle 2
    { id: '4', vehicleId: 'veh-2', date: Timestamp.fromDate(new Date('2023-11-10')), label: 'Plaquettes de frein', mileage: 85400, price: 180, garage: 'Speedy' },
    { id: '5', vehicleId: 'veh-2', date: Timestamp.fromDate(new Date('2023-01-20')), label: 'Batterie', mileage: 78200, price: 220, garage: 'Midas' },
];

export default function Dashboard({ user }: { user: FirebaseUser }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [maintenanceEntries, setMaintenanceEntries] = useState<MaintenanceEntry[]>(mockEntries);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(mockVehicles.length > 0 ? mockVehicles[0].id : null);
  
  const [loading, setLoading] = useState(false);
  const [isMaintenanceFormOpen, setIsMaintenanceFormOpen] = useState(false);
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false);

  const selectedVehicle = useMemo(() => vehicles.find(v => v.id === selectedVehicleId), [vehicles, selectedVehicleId]);

  const filteredEntries = useMemo(() => {
    if (!selectedVehicleId) return [];
    return maintenanceEntries
      .filter(entry => entry.vehicleId === selectedVehicleId)
      .sort((a, b) => b.date.toMillis() - a.date.toMillis());
  }, [maintenanceEntries, selectedVehicleId]);

  const { totalCost, lastMileage } = useMemo(() => {
    if (!selectedVehicle) return { totalCost: 0, lastMileage: 0};
    const entries = filteredEntries;
    const totalCost = entries.reduce((acc, entry) => acc + entry.price, 0);
    const lastMileage = entries.length > 0 ? entries[0].mileage : selectedVehicle.mileage;
    return { totalCost, lastMileage };
  }, [filteredEntries, selectedVehicle]);
  
  const handleAddVehicle = (newVehicle: Omit<Vehicle, 'id'>) => {
    const newVehicles = [...vehicles, { ...newVehicle, id: `veh-${Date.now()}` }];
    setVehicles(newVehicles);
    if (!selectedVehicleId) {
      setSelectedVehicleId(newVehicles[0].id);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <main className="container mx-auto p-4 md:p-8">

        <VehicleSelector 
          vehicles={vehicles}
          onVehicleSelect={setSelectedVehicleId}
          onAddVehicle={() => setIsVehicleFormOpen(true)}
          selectedVehicleId={selectedVehicleId}
        />
        <AddVehicleForm 
          isOpen={isVehicleFormOpen}
          setIsOpen={setIsVehicleFormOpen}
          onAddVehicle={handleAddVehicle}
        />

        {selectedVehicle ? (
          <>
            <Summary totalCost={totalCost} lastMileage={lastMileage} loading={loading} />
            
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-headline">Carnet d'entretien</h2>
                <Button onClick={() => setIsMaintenanceFormOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une entrée
                </Button>
                <MaintenanceForm 
                  user={user} 
                  vehicleId={selectedVehicle.id}
                  isOpen={isMaintenanceFormOpen} 
                  setIsOpen={setIsMaintenanceFormOpen} 
                />
              </div>
              {loading ? (
                 <div className="w-full space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                 </div>
              ) : (
                <MaintenanceLog entries={filteredEntries} />
              )}
            </div>
          </>
        ) : (
           <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-2">Aucun véhicule trouvé</h2>
              <p className="text-muted-foreground mb-4">Commencez par ajouter votre premier véhicule.</p>
              <Button onClick={() => setIsVehicleFormOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un véhicule
              </Button>
            </div>
        )}
      </main>
    </div>
  );
}
