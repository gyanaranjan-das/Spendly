import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import DeleteTransactionButton from './_components/DeleteTransactionButton';

export const metadata = {
  title: 'Transactions | Spendly',
};

async function getTransactions(userId) {
  await dbConnect();
  const transactions = await Transaction.find({ user: userId })
    .sort({ date: -1 })
    .lean();
    
  return transactions.map(t => ({
    ...t,
    _id: t._id.toString(),
    user: t.user.toString(),
    date: t.date.toISOString(),
  }));
}

export default async function TransactionsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const transactions = await getTransactions(session.user.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <Link href="/transactions/new">
          <Button>Add Transaction</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No transactions found.</TableCell>
                </TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx._id}>
                    <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell>{tx.description || '-'}</TableCell>
                    <TableCell>{tx.category}</TableCell>
                    <TableCell className={`text-right font-medium ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DeleteTransactionButton id={tx._id} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
