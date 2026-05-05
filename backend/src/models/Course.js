import mongoose from 'mongoose';

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    facultyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'inactive', 'archived'], default: 'active' },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Alias facultyId -> faculty for clean frontend consumption
        if (ret.facultyId !== undefined) {
          ret.faculty = ret.facultyId;
          delete ret.facultyId;
        }
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model('Course', courseSchema);
