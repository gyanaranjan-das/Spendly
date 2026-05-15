'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Papa from 'papaparse';
import jsPDF from 'jspdf';

export default function ExportButtons({ transactions }) {
  const handleExportCSV = () => {
    try {
      if (!transactions || transactions.length === 0) {
        toast.info('No transactions to export');
        return;
      }

      const csv = Papa.unparse(transactions.map(t => ({
        Date: new Date(t.date).toLocaleDateString(),
        Type: t.type,
        Category: t.category,
        Amount: t.amount,
        Description: t.description || ''
      })));

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'transactions.csv';
      link.click();
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const handleExportPDF = () => {
    try {
      if (!transactions || transactions.length === 0) {
        toast.info('No transactions to export');
        return;
      }

      const doc = new jsPDF();
      doc.text('Transaction Report', 20, 20);
      
      let y = 30;
      transactions.forEach((t) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        const text = `${new Date(t.date).toLocaleDateString()} | ${t.type.toUpperCase()} | ${t.category} | ${t.amount} INR`;
        doc.text(text, 20, y);
        y += 10;
      });

      doc.save('transactions.pdf');
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  return (
    <div className="flex gap-4">
      <Button onClick={handleExportCSV}>Export CSV</Button>
      <Button variant="outline" onClick={handleExportPDF}>Export PDF</Button>
    </div>
  );
}
