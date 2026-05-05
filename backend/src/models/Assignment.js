import mongoose from 'mongoose';

const { Schema } = mongoose;

const assignmentSchema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true, trim: true },
    dueDate: { type: Date, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        if (ret.courseId !== undefined) { ret.course = ret.courseId; delete ret.courseId; }
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model('Assignment', assignmentSchema);
