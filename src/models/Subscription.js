import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a subscription name'],
    },
    cost: {
      type: Number,
      required: [true, 'Please provide the cost'],
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      required: [true, 'Please specify the billing cycle'],
    },
    nextRenewalDate: {
      type: Date,
      required: [true, 'Please provide the next renewal date'],
    },
    url: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Subscriptions',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
