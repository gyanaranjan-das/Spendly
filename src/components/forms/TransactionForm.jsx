'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TransactionForm({ onSuccess }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const amount = formData.get('amount');
    const type = formData.get('type');
    const category = formData.get('category');
    const date = formData.get('date');
    const description = formData.get('description');

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, type, category, date, description }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        toast.success('Transaction added');
        router.refresh(); // Refresh Server Components
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.error || 'Failed to add transaction');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input id="amount" name="amount" type="number" step="0.01" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <Select name="type" required>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" placeholder="e.g. Food, Salary, Rent" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input id="description" name="description" />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Transaction'}
      </Button>
    </form>
  );
}
