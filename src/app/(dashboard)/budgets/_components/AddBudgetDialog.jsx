'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AddBudgetDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const category = formData.get('category');
    const amount = formData.get('amount');
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, amount, month, year }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Budget added');
        setOpen(false);
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to add budget');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Budget</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Budget Limit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" placeholder="e.g. Food, Overall" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Monthly Limit (₹)</Label>
            <Input id="amount" name="amount" type="number" step="0.01" required />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Set Budget'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
