const roi = require('../models/add_roi_model');

// Create a new Todo
exports.createRoi = async (req, res) => {
    try {
        const {board_name,exam_type,stream,examination_year,boundaries } = req.body;
        const newRoi = new roi({ board_name,exam_type,stream,examination_year,boundaries });
        const savedRoi = await newRoi.save();
        res.status(201).json(savedRoi);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create ROI' });
    }
};

// Retrieve all Todos
exports.getAllTodos = async (req, res) => {
    try {
        const todos = await roi.find();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve todos' });
    }
};

// Update a Todo
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, description, completed },
            { new: true }
        );

        res.json(updatedTodo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
};

// Delete a Todo
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        await Todo.findByIdAndDelete(id);
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
};
