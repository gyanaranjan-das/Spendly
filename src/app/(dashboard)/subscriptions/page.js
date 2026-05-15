import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import AddSubscriptionDialog from './_components/AddSubscriptionDialog';
import DeleteSubscriptionButton from './_components/DeleteSubscriptionButton';

export const metadata = {
  title: 'Subscriptions | Spendly',
};

async function getSubscriptions(userId) {
  await dbConnect();
  const subs = await Subscription.find({ user: userId })
    .sort({ nextRenewalDate: 1 })
    .lean();
    
  return subs.map(s => ({
    ...s,
    _id: s._id.toString(),
    user: s.user.toString(),
    nextRenewalDate: s.nextRenewalDate.toISOString(),
  }));
}

export default async function SubscriptionsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const subscriptions = await getSubscriptions(session.user.id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Subscriptions</h1>
        <AddSubscriptionDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Billing Cycle</TableHead>
                <TableHead>Next Renewal</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No subscriptions found.</TableCell>
                </TableRow>
              ) : (
                subscriptions.map((sub) => (
                  <TableRow key={sub._id}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>₹{sub.cost.toFixed(2)}</TableCell>
                    <TableCell className="capitalize">{sub.billingCycle}</TableCell>
                    <TableCell>{new Date(sub.nextRenewalDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DeleteSubscriptionButton id={sub._id} />
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
