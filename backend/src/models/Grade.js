import mongoose from 'mongoose';

const { Schema } = mongoose;

const gradeSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    letter: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        if (ret.studentId !== undefined) { ret.student = ret.studentId; delete ret.studentId; }
        if (ret.courseId !== undefined) { ret.course = ret.courseId; delete ret.courseId; }
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

gradeSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Grade', gradeSchema, 'Grade');
