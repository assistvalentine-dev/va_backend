import { verify } from 'crypto';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Age must be at least 18'],
      max: [100, 'Age cannot exceed 100'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female', 'Other'],
    },
    interestedIn: {
      type: String,
      required: [true, 'Interested in field is required'],
      enum: ['Male', 'Female', 'Any'],
    },
    college: {
      type: String,
      required: [true, 'College is required'],
      trim: true,
      maxlength: [100, 'College name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    relationshipGoal: {
      type: String,
      required: [true, 'Relationship goal is required'],
      enum: ['Casual', 'Serious', 'Marriage'],
    },
    description: {
      type: String,
      required: [true, 'Self description is required'],
      trim: true
    },
    preferences: {
      type: String,
      required: [true, 'Partner preferences are required'],
      trim: true
    },
    interests: {
      type: String,
      required: [true, 'Interests are required'],
      enum: ['Yes', 'No'],
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID','FREE'],
      default: 'PENDING',
    },
    paymentId: {
      type: String,
      default: null,
    },
    razorpayOrderId: {
      type: String,
      default: null,
    },
    stripePaymentIntentId: {
      type: String,
      default: null,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    verifiedId: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ paymentStatus: 1 });
userSchema.index({ verifiedId: 1 });

const User = mongoose.model('User', userSchema);

export default User;


