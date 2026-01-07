"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { FirebaseUser, MaintenanceEntry } from "@/lib/types";

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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const formSchema = z.object({
  date: z.date({
    required_error: "Une date pour l'intervention est requise.",
  }),
  label: z.string().min(2, "Le libellé doit comporter au moins 2 caractères."),
  mileage: z.coerce.number().min(0, "Le kilométrage doit être un nombre positif."),
  price: z.coerce.number().min(0, "Le prix doit être un nombre positif."),
  garage: z.string().min(2, "Le nom du garage doit comporter au moins 2 caractères."),
  invoice: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface MaintenanceFormProps {
  user: FirebaseUser;
  vehicleId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onMaintenanceSubmit: (data: FormData) => void;
  entryToEdit?: MaintenanceEntry;
  onClose?: () => void;
}

export default function MaintenanceForm({ user, vehicleId, isOpen, setIsOpen, onMaintenanceSubmit, entryToEdit, onClose }: MaintenanceFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!entryToEdit;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditing && entryToEdit) {
         form.reset({
          ...entryToEdit,
          date: entryToEdit.date.toDate(),
          invoice: undefined,
        });
      } else {
        form.reset({
          label: "",
          garage: "",
          date: new Date(),
          mileage: undefined,
          price: undefined,
          invoice: undefined,
        });
      }
    }
  }, [isOpen, isEditing, entryToEdit, form]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Dialog is closing
      onClose?.();
    }
    setIsOpen(open);
  }

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onMaintenanceSubmit(values);

    toast({
        title: isEditing ? "Entrée mise à jour !" : "Entrée ajoutée !",
        description: `L'entrée "${values.label}" a été enregistrée.`,
    });
    
    handleOpenChange(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier une entrée" : "Ajouter une entrée de maintenance"}</DialogTitle>
          <DialogDescription>
            Remplissez les détails de l'intervention de maintenance.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span>Choisissez une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Libellé</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Vidange moteur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilométrage (km)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="123456" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="150.00" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="garage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garage</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: Garage Local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoice"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Facture (Image)</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                          onChange(e.target.files ? e.target.files[0] : null);
                      }}
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Enregistrer les modifications' : 'Enregistrer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
