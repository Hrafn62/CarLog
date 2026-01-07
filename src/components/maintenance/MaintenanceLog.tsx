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
import { FileText } from "lucide-react";

interface MaintenanceLogProps {
  entries: MaintenanceEntry[];
}

export default function MaintenanceLog({ entries }: MaintenanceLogProps) {
    
  const formatDate = (timestamp: any) => {
      if (!timestamp?.toDate) return 'Invalid Date';
      return timestamp.toDate().toLocaleDateString();
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }

  const formatMileage = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value) + ' km';
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>No maintenance entries yet.</p>
          <p className="text-sm">Click "Add Entry" to get started.</p>
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
            <TableHead>Label</TableHead>
            <TableHead className="text-right">Mileage</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead>Garage</TableHead>
            <TableHead className="text-center">Invoice</TableHead>
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
                    <a href={entry.invoiceUrl} target="_blank" rel="noopener noreferrer" aria-label="View invoice">
                      <FileText className="h-4 w-4" />
                    </a>
                  </Button>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
