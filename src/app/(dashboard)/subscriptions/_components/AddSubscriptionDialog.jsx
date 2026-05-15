'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AddSubscriptionDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const cost = formData.get('cost');
    const billingCycle = formData.get('billingCycle');
    const nextRenewalDate = formData.get('nextRenewalDate');

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, cost, billingCycle, nextRenewalDate }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Subscription added');
        setOpen(false);
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to add subscription');
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
        <Button>Add Subscription</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Service Name</Label>
            <Input id="name" name="name" placeholder="e.g. Netflix, Spotify" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cost">Cost (₹)</Label>
            <Input id="cost" name="cost" type="number" step="0.01" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="billingCycle">Billing Cycle</Label>
            <Select name="billingCycle" required>
              <SelectTrigger>
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nextRenewalDate">Next Renewal Date</Label>
            <Input id="nextRenewalDate" name="nextRenewalDate" type="date" required />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Subscription'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
