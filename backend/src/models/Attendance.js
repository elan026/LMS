import mongoose from 'mongoose';

const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    date: { type: Date, required: true },
    status: { type: String, enum: ['PRESENT', 'ABSENT', 'LATE'], default: 'PRESENT' },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

attendanceSchema.index({ studentId: 1, courseId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema, 'Attendance');
