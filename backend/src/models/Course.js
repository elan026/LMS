import mongoose from 'mongoose';

const { Schema } = mongoose;

const courseSchema = new Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED', 'DRAFT'], default: 'ACTIVE' },
    semester: { type: String, required: true },
    year: { type: Number, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Alias instructorId -> instructor and faculty for clean frontend consumption
        if (ret.instructorId !== undefined) {
          ret.instructor = ret.instructorId;
          ret.faculty = ret.instructorId;
          delete ret.instructorId;
        }
        // Ensure status is lowercase for frontend if needed (though ACTIVE is fine if UI handles it)
        // But UI uses e.status === 'active'
        if (ret.status) ret.status = ret.status.toLowerCase();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model('Course', courseSchema, 'Course');
