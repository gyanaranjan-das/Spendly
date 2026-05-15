import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Subscription from '@/models/Subscription';
import Budget from '@/models/Budget';

export async function getDashboardData(month, year) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await dbConnect();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const transactions = await Transaction.find({
    user: session.user.id,
    date: { $gte: startDate, $lte: endDate }
  }).lean();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const subscriptions = await Subscription.find({ user: session.user.id }).lean();
  const monthlySubscriptionCost = subscriptions.reduce((sum, sub) => {
    return sub.billingCycle === 'yearly' ? sum + (sub.cost / 12) : sum + sub.cost;
  }, 0);

  const expensesByCategory = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!expensesByCategory[t.category]) expensesByCategory[t.category] = 0;
      expensesByCategory[t.category] += t.amount;
    });

  const categoryBreakdown = Object.keys(expensesByCategory).map(key => ({
    name: key,
    value: expensesByCategory[key]
  }));

  const budgets = await Budget.find({
    user: session.user.id,
    month: parseInt(month),
    year: parseInt(year)
  }).lean();

  // Convert ObjectIds/Dates to strings for Server Component props
  const serializedTransactions = transactions.map(t => ({
    ...t,
    _id: t._id.toString(),
    user: t.user.toString(),
    date: t.date.toISOString(),
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  const serializedBudgets = budgets.map(b => ({
    ...b,
    _id: b._id.toString(),
    user: b.user.toString(),
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }));

  return {
    totalIncome,
    totalExpense,
    monthlySubscriptionCost,
    balance: totalIncome - totalExpense,
    categoryBreakdown,
    recentTransactions: serializedTransactions.slice(0, 5).sort((a, b) => new Date(b.date) - new Date(a.date)),
    budgets: serializedBudgets
  };
}
