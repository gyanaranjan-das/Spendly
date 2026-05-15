import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import Subscription from '@/models/Subscription';
import Budget from '@/models/Budget';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const month = searchParams.get('month') || new Date().getMonth() + 1;
    const year = searchParams.get('year') || new Date().getFullYear();

    // Start and end of month dates
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // 1. Get transactions for the month
    const transactions = await Transaction.find({
      user: session.user.id,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // 2. Get active subscriptions (calc monthly cost)
    const subscriptions = await Subscription.find({ user: session.user.id });
    const monthlySubscriptionCost = subscriptions.reduce((sum, sub) => {
      return sub.billingCycle === 'yearly' ? sum + (sub.cost / 12) : sum + sub.cost;
    }, 0);

    // 3. Category breakdown
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

    // 4. Get Budgets
    const budgets = await Budget.find({
      user: session.user.id,
      month: parseInt(month),
      year: parseInt(year)
    });

    return NextResponse.json({
      totalIncome,
      totalExpense,
      monthlySubscriptionCost,
      balance: totalIncome - totalExpense,
      categoryBreakdown,
      recentTransactions: transactions.slice(0, 5).sort((a, b) => b.date - a.date),
      budgets
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
