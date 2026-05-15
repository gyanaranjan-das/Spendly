'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import TransactionForm from '@/components/forms/TransactionForm';
import { useRouter } from 'next/navigation';

export default function InterceptedNewTransactionModal() {
  const router = useRouter();

  const handleOpenChange = (open) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog defaultOpen onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>
        <TransactionForm onSuccess={() => router.back()} />
      </DialogContent>
    </Dialog>
  );
}
