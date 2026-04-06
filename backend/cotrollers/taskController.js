const taskService = require('../services/taskService');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        // Convert integer boolean back to real boolean
        const formatted = tasks.map(t => ({...t, completed: !!t.completed}));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, progress, completed } = req.body;
        if (!title) return res.status(400).json({ error: "Title is required" });
        const newTask = await taskService.createTask(title, progress, completed);
        res.status(201).json({...newTask, completed: !!newTask.completed});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, progress, completed } = req.body;
        const updatedTask = await taskService.updateTask(id, title, progress, completed);
        res.json({...updatedTask, completed: !!updatedTask.completed});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await taskService.deleteTask(id);
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
