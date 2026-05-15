import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
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

    const budgets = await Budget.find({ 
      user: session.user.id,
      month: parseInt(month),
      year: parseInt(year)
    });

    return NextResponse.json({ budgets }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    // Prevent duplicate budgets for same category, month and year
    const existingBudget = await Budget.findOne({
      user: session.user.id,
      category: data.category || 'Overall',
      month: data.month,
      year: data.year
    });

    if (existingBudget) {
      return NextResponse.json({ error: 'Budget already exists for this period' }, { status: 400 });
    }

    const budget = await Budget.create({
      ...data,
      user: session.user.id,
    });

    return NextResponse.json({ budget }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
