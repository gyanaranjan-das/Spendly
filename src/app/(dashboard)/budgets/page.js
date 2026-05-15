import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Budget from '@/models/Budget';
import AddBudgetDialog from './_components/AddBudgetDialog';
import DeleteBudgetButton from './_components/DeleteBudgetButton';

export const metadata = {
  title: 'Budgets | Spendly',
};

async function getBudgets(userId) {
  await dbConnect();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const budgets = await Budget.find({ user: userId, month, year })
    .lean();
    
  return budgets.map(b => ({
    ...b,
    _id: b._id.toString(),
    user: b.user.toString(),
  }));
}

export default async function BudgetsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const budgets = await getBudgets(session.user.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
        <AddBudgetDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Month Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Limit Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No budgets set for this month.</TableCell>
                </TableRow>
              ) : (
                budgets.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell className="font-medium">{b.category}</TableCell>
                    <TableCell>₹{b.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DeleteBudgetButton id={b._id} />
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
