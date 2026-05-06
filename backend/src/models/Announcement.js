import mongoose from 'mongoose';

const { Schema } = mongoose;

const announcementSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id.toString();
        // Alias createdBy -> author for frontend compatibility
        if (ret.createdBy !== undefined) {
          ret.author = ret.createdBy;
          delete ret.createdBy;
        }
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default mongoose.model('Announcement', announcementSchema, 'Announcement');
