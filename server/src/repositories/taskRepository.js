import BaseRepository from './baseRepository.js';
import Task from '../models/mysql/task.js';
import { Op } from 'sequelize';

class TaskRepository extends BaseRepository {
  constructor() {
    super(Task);
  }

  async get(id, userId) {
    return this.model.findOne({ where: { id, userId } });
  }

  async update(id, userId, data) {
    await this.model.update(data, {
      where: {
        id,
        userId
      }
    });
    return this.get(id, userId);
  }

  async all(userId, filters = {}) {
    const where = { userId };

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }
    if (filters.hasAttachment === 'true') {
      where.mediaUrl = { [Op.ne]: null };
    }
    if (filters.endDate) {
      where.dueDate = { [Op.lte]: new Date(filters.endDate) };
    }

    return this.model.findAll({ where });
  }
}

const taskRepository = new TaskRepository();
export default taskRepository;