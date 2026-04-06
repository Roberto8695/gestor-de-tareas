const db = require('../config/db');

exports.getAllTasks = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM tasks", [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

exports.createTask = (title, progress, completed) => {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO tasks (title, progress, completed) VALUES (?, ?, ?)",
            [title, progress || 0, completed ? 1 : 0],
            function (err) {
                if (err) reject(err);
                resolve({ id: this.lastID, title, progress, completed });
            }
        );
    });
};

exports.updateTask = (id, title, progress, completed) => {
    return new Promise((resolve, reject) => {
        db.run(
            "UPDATE tasks SET title = ?, progress = ?, completed = ? WHERE id = ?",
            [title, progress || 0, completed ? 1 : 0, id],
            function (err) {
                if (err) reject(err);
                resolve({ id, title, progress, completed });
            }
        );
    });
};

exports.deleteTask = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
            if (err) reject(err);
            resolve(true);
        });
    });
};
