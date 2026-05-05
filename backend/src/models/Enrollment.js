import mongoose from 'mongoose';

const { Schema } = mongoose;

const enrollmentSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Alias ref fields for clean frontend consumption
        if (ret.studentId !== undefined) { ret.student = ret.studentId; delete ret.studentId; }
        if (ret.courseId !== undefined) { ret.course = ret.courseId; delete ret.courseId; }
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
