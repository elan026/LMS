import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'faculty', 'student', 'ADMIN', 'FACULTY', 'STUDENT'], default: 'STUDENT' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        if (ret.role) ret.role = ret.role.toLowerCase();
        delete ret._id;
        delete ret.__v;
        delete ret.password_hash;
      },
    },
  }
);

export default mongoose.model('User', userSchema, 'User');
