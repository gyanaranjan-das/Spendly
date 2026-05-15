import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ExportButtons from './_components/ExportButtons';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';

export const metadata = {
  title: 'Settings | Spendly',
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

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const transactions = await getTransactions(session.user.id);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>Export your transaction data for backup or analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <ExportButtons transactions={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
