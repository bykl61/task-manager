import taskService from '../services/taskService.js';

class TaskController {
  async create(req, res) {
    const result = await taskService.create(
      req.user.id,
      req.body,
      req.file
    );

    if (result.error) {
      return res.status(400).json(result.error);
    }

    res.status(201).json(result.data);
  }

  async get(req, res) {
    const result = await taskService.get(req.user.id, req.params.id);

    if (result.error) {
      return res.status(404).json(result.error);
    }

    res.json(result.data);
  }

  async all(req, res) {
    const result = await taskService.all(req.user.id, req.query);
    res.json(result.data);
  }

  async update(req, res) {
    const result = await taskService.update(
      req.user.id,
      req.params.id,
      req.body,
      req.file
    );

    if (result.error) {
      return res.status(400).json(result.error);
    }

    res.json(result.data);
  }

  async delete(req, res) {
    const result = await taskService.delete(req.user.id, req.params.id);

    if (result.error) {
      return res.status(404).json(result.error);
    }

    res.json({ message: 'Task deleted successfully' });
  }
}

export default new TaskController();