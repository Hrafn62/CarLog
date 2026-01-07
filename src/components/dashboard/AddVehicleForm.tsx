"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Vehicle } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères."),
  brand: z.string().min(2, "La marque doit comporter au moins 2 caractères."),
  model: z.string().min(2, "Le modèle doit comporter au moins 2 caractères."),
  year: z.coerce.number().min(1900, "L'année doit être valide.").max(new Date().getFullYear() + 1, "L'année ne peut pas être dans le futur."),
  mileage: z.coerce.number().min(0, "Le kilométrage doit être un nombre positif."),
});

type FormData = z.infer<typeof formSchema>;

interface AddVehicleFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
}

export default function AddVehicleForm({ isOpen, setIsOpen, onAddVehicle }: AddVehicleFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      model: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    console.log("Simulating add vehicle with values:", values);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    onAddVehicle(values);
    
    toast({
        title: "Véhicule ajouté !",
        description: `${values.name} a été ajouté à votre garage.`,
    });
    form.reset();
    setIsOpen(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
          <DialogDescription>
            Remplissez les informations de votre véhicule.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du véhicule</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Ma voiture principale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Peugeot" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: 208" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilométrage (km)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ajouter le véhicule
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
