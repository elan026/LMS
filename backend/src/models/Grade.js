import mongoose from 'mongoose';

const { Schema } = mongoose;

const gradeSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    gradedById: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        if (ret.studentId !== undefined) { ret.student = ret.studentId; delete ret.studentId; }
        if (ret.courseId !== undefined) { ret.course = ret.courseId; delete ret.courseId; }
        if (ret.gradedById !== undefined) { ret.gradedBy = ret.gradedById; delete ret.gradedById; }
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

gradeSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Grade', gradeSchema);
