// services/taskScheduler.js
import cron from 'node-cron';
import { Op } from 'sequelize';
import Task from '../models/mysql/task.js';
import User from '../models/mysql/user.js';
import ActivityLogService from '../services/activitiyLog.js';

class TaskScheduler {
  constructor() {
    this.notifiedTaskIds = new Set();
  }

  init() {
    // Saatte bir çalış
    cron.schedule('0 * * * *', async () => {
      try {
        const now = new Date();
        console.log('\n[SCHEDULER] Checking tasks at:', now);

        // Son 1 günü kalan görevleri bul
        const oneDay = 24 * 60 * 60 * 1000; // 24 saat
        const tasks = await Task.findAll({
          where: {
            status: 'pending',
            dueDate: {
              [Op.lte]: new Date(now.getTime() + oneDay), // 1 gün sonrası
              [Op.gt]: now
            },
            id: {
              [Op.notIn]: Array.from(this.notifiedTaskIds)
            }
          },
          include: [User]
        });

        console.log(`[SCHEDULER] Found ${tasks.length} tasks`);

        for (const task of tasks) {
          if (!task.User) continue;

          console.log('\n=== MAIL NOTIFICATION ===');
          console.log(`📋 Task: ${task.title}`);
          console.log(`⏰ Due Date: ${task.dueDate}`);
          console.log('========================\n');

          this.notifiedTaskIds.add(task.id);

          await ActivityLogService.create({
            taskId: task.id,
            userId: task.userId,
            action: 'MAIL_SENT',
            details: {
              dueDate: task.dueDate,
              title: task.title,
              recipientEmail: task.User.email
            }
          });
        }

        // Bildirilen görev ID'lerini temizle
        if (this.notifiedTaskIds.size > 1000) {
          this.notifiedTaskIds.clear();
        }
      } catch (error) {
        console.error('[SCHEDULER] Error:', error);
      }
    });

    console.log('Task scheduler initialized');
  }
}

export default new TaskScheduler();