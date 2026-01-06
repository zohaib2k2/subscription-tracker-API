import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, 'subscription is required'],
        trim: true,
        minLength:2,
        maxLength:100,
    },
    price: {
        type:Number,
        required: [true, 'subscription price is required'],
        min:[0,'price must be greater then 0'],
        max:[1000,'price needs to be less then 1000'],
    },
    currency: {
        type:String,
        required: [true, 'currency is required'],
        enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'AUD', 'CAD'],
        default: 'USD',
    },
    billingCycle: { 
        type: String,
        required: [true, 'billing cycle is required'],
        enum: ['monthly', 'yearly', 'quarterly'],
        default: 'monthly',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly',
    },
    category: {
        type: String,
        enum: ['Entertainment', 'Software', 'Utilities', 'Education', 'Healthcare', 'Finance'],
        required: [true, 'category is required'],
    },
    paymentMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cryptocurrency'],
        required: [true, 'payment method is required'],
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'paused'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: [true, 'start date is required'],
        validate: {
            validator: function(value) {
                return value <= new Date();
            },
            message: 'Start date cannot be in the future'
        },
    },
    renewalDate: {
        type: Date,
        required: [true, 'renewal date is required'],
        validate: {
            validator: function(value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date'
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

}, {timestamps: true});

// Auto calculate renewalDate based on startDate and billingCycle
subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate) {
        const renewalperiods = {
            'daily': 1,
            'weekly': 7,
            'monthly': 30,
            'yearly': 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalperiods[this.frequency]);

    }

    if (this.renewalDate < new Date()) {
        this.status = 'expired';
    }
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;