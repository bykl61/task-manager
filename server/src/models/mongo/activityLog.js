import { mongoose } from '../../config/mongodb.js'; // mongoose instance'ını import ediyoruz

const activityLogSchema = new mongoose.Schema(
  {
    taskId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'CREATED',
        'UPDATED',
        'STATUS_CHANGED',
        'FILE_ADDED',
        'DELETED',
        'MAIL_SENT',
      ],
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;