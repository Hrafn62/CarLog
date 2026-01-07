"use client";

import type { MaintenanceEntry } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MaintenanceLogProps {
  entries: MaintenanceEntry[];
  onEdit: (entry: MaintenanceEntry) => void;
  onDelete: (entryId: string) => void;
}

export default function MaintenanceLog({ entries, onEdit, onDelete }: MaintenanceLogProps) {
    
  const formatDate = (timestamp: any) => {
      if (!timestamp?.toDate) return 'Date invalide';
      return timestamp.toDate().toLocaleDateString('fr-FR');
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
  }

  const formatMileage = (value: number) => {
    return new Intl.NumberFormat('fr-FR').format(value) + ' km';
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>Aucune entrée de maintenance pour le moment.</p>
          <p className="text-sm">Cliquez sur "Ajouter une entrée" pour commencer.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Libellé</TableHead>
            <TableHead className="text-right">Kilométrage</TableHead>
            <TableHead className="text-right">Prix</TableHead>
            <TableHead>Garage</TableHead>
            <TableHead className="text-center">Facture</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{formatDate(entry.date)}</TableCell>
              <TableCell className="font-medium">{entry.label}</TableCell>
              <TableCell className="text-right">{formatMileage(entry.mileage)}</TableCell>
              <TableCell className="text-right">{formatCurrency(entry.price)}</TableCell>
              <TableCell>{entry.garage}</TableCell>
              <TableCell className="text-center">
                {entry.invoiceUrl ? (
                  <Button variant="ghost" size="icon" asChild>
                    <a href={entry.invoiceUrl} target="_blank" rel="noopener noreferrer" aria-label="Voir la facture">
                      <FileText className="h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem onClick={() => onEdit(entry)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                           <Trash2 className="mr-2 h-4 w-4" />
                           Supprimer
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. L'entrée de maintenance sera définitivement supprimée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(entry.id)} className="bg-destructive hover:bg-destructive/90">
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
