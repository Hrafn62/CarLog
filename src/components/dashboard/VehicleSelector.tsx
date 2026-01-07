"use client";

import * as React from "react"
import type { Vehicle } from "@/lib/types";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button";
import { Car, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  onVehicleSelect: (vehicleId: string | null) => void;
  onAddVehicle: () => void;
  selectedVehicleId: string | null;
}

export default function VehicleSelector({ vehicles, onVehicleSelect, onAddVehicle, selectedVehicleId }: VehicleSelectorProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    const initialSlide = vehicles.findIndex(v => v.id === selectedVehicleId);
    if (initialSlide !== -1) {
        api.scrollTo(initialSlide);
        setCurrent(initialSlide);
    } else if (vehicles.length > 0) {
        onVehicleSelect(vehicles[0].id);
        setCurrent(0);
    } else {
        onVehicleSelect(null);
    }


    const handleSelect = () => {
      const selectedIndex = api.selectedScrollSnap();
      setCurrent(selectedIndex)
      if (vehicles[selectedIndex]) {
        onVehicleSelect(vehicles[selectedIndex].id);
      }
    }

    api.on("select", handleSelect)

    return () => {
      api.off("select", handleSelect)
    }
  }, [api, vehicles, onVehicleSelect, selectedVehicleId])
  
  if (vehicles.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
        <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
            {vehicles.map((vehicle) => (
            <CarouselItem key={vehicle.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                <Card 
                    className={cn(
                        "transition-all", 
                        selectedVehicleId === vehicle.id ? "border-primary shadow-lg" : "border-border"
                    )}
                >
                    <CardContent className="flex flex-col items-center justify-center p-6 gap-2">
                        <Car className="w-8 h-8 text-muted-foreground" />
                        <span className="text-lg font-semibold">{vehicle.name}</span>
                        <p className="text-sm text-muted-foreground">{vehicle.brand} {vehicle.model} - {vehicle.year}</p>
                    </CardContent>
                </Card>
                </div>
            </CarouselItem>
            ))}
            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                 <div className="p-1 h-full">
                    <Card 
                        onClick={onAddVehicle}
                        className="h-full border-dashed border-2 flex items-center justify-center hover:border-primary hover:text-primary transition-all cursor-pointer"
                    >
                        <CardContent className="p-6 flex flex-col items-center justify-center gap-2">
                            <PlusCircle className="w-8 h-8" />
                            <span className="font-semibold">Ajouter un véhicule</span>
                        </CardContent>
                    </Card>
                </div>
            </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
        </Carousel>
         <div className="py-2 text-center text-sm text-muted-foreground">
            Véhicule {current + 1} sur {vehicles.length}
        </div>
    </div>
  )
}
