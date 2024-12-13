import taskRepository from '../repositories/taskRepository.js';
import { ErrorHelper } from '../utils/errorHelper.js';
import { taskSchema, taskUpdateSchema } from '../middleware/validation/task.js';
import { uploadFile } from '../utils/fileUpload.js';
import { mediaTypeHelper } from '../utils/mediaTypeHelper.js';
import redisClient from '../config/redis.js';
import ActivityLogService from './activitiyLog.js';
import { clearCache } from '../utils/redisHelper.js';

class TaskService {
  async create(userId, taskData, file) {
    const { error } = taskSchema.validate(taskData, { abortEarly: false });
    if (error) {
      return { error: ErrorHelper.validationError(error) };
    }

    if (file) {
      const uploadResult = await uploadFile(file);
      taskData.mediaUrl = uploadResult.url;
      taskData.mediaType = mediaTypeHelper.determineType(file.mimetype);
    }

    taskData.userId = userId;
    const task = await taskRepository.create(taskData);

    await ActivityLogService.create({
      taskId: task.id,
      userId,
      action: 'CREATED',
      newValue: task
    });

    await clearCache(`tasks:${userId}:*`);

    return { success: true, data: task };
  }

  async get(userId, taskId) {
    const task = await taskRepository.get(taskId, userId);
    if (!task) {
      return { error: ErrorHelper.notFoundError('Task not found') };
    }
    return { success: true, data: task };
  }

  async all(userId, filters) {
    const cacheKey = `tasks:${userId}:${JSON.stringify(filters)}`;
    const cachedTasks = await redisClient.get(cacheKey);

    if (cachedTasks) {
      return { success: true, data: JSON.parse(cachedTasks) };
    }

    const tasks = await taskRepository.all(userId, filters);
    await redisClient.setEx(cacheKey, 300, JSON.stringify(tasks));

    return { success: true, data: tasks };
  }

  async update(userId, taskId, taskData, file) {
    const { error } = taskUpdateSchema.validate(taskData, { abortEarly: false });
    if (error) {
      return { error: ErrorHelper.validationError(error) };
    }

    const existingTask = await taskRepository.get(taskId, userId);
    if (!existingTask) {
      return { error: ErrorHelper.notFoundError('Task not found') };
    }

    if (file) {
      const uploadResult = await uploadFile(file);
      taskData.mediaUrl = uploadResult.url;
      taskData.mediaType = mediaTypeHelper.determineType(file.mimetype);
    }

    const updatedTask = await taskRepository.update(taskId, userId, taskData);

    await ActivityLogService.create({
      taskId,
      userId,
      action: 'UPDATED',
      oldValue: existingTask,
      newValue: updatedTask
    });

    await clearCache(`tasks:${userId}:*`);

    return { success: true, data: updatedTask };
  }

  async delete(userId, taskId) {
    const task = await taskRepository.get(taskId, userId);
    if (!task) {
      return { error: ErrorHelper.notFoundError('Task not found') };
    }

    await taskRepository.delete(taskId, userId);

    await ActivityLogService.create({
      taskId,
      userId,
      action: 'DELETED',
      oldValue: task
    });

    await clearCache(`tasks:${userId}:*`);

    return { success: true };
  }
}

export default new TaskService;