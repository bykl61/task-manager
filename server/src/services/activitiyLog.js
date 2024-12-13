import ActivityLog from '../models/mongo/ActivityLog.js';

class ActivityLogService {
  async create(logData) {
    try {
      await ActivityLog.create(logData);
    } catch (error) {
      console.error('Activity log creation failed:', error);
    }
  }

  async getTaskLogs(taskId) {
    return ActivityLog.find({ taskId }).sort({ createdAt: -1 });
  }

  async getUserLogs(userId) {
    return ActivityLog.find({ userId }).sort({ createdAt: -1 });
  }
}

export default new ActivityLogService;