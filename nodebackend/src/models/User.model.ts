import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IKycDocument {
  docType: string;
  fileUrl: string;
  uploadedAt: Date;
}

export interface IUserProfile {
  fullName: string;
  email: string;
  dob: Date;
  address: string;
  city: string;
  state: string;
}

export interface IUser extends Document {
  phoneNumber: string;
  email?: string;
  referralCode?: string;
  isProfileSetup: boolean;
  isKycDone: boolean;
  profile?: IUserProfile;
  kycDocuments: IKycDocument[];
  otp?: string;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const KycDocumentSchema = new Schema({
  docType: {
    type: String,
    required: true,
    enum: ['PAN Card', 'Aadhaar Card']
  },
  fileUrl: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const UserProfileSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  }
});

const UserSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true,
    trim: true
  },
  referralCode: {
    type: String,
    trim: true
  },
  isProfileSetup: {
    type: Boolean,
    default: false
  },
  isKycDone: {
    type: Boolean,
    default: false
  },
  profile: UserProfileSchema,
  kycDocuments: [KycDocumentSchema],
  otp: {
    type: String
  },
  otpExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
UserSchema.index({ phoneNumber: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ isProfileSetup: 1, isKycDone: 1 });

export default mongoose.model<IUser>('User', UserSchema);