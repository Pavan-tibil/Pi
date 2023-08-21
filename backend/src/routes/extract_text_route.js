const express = require('express');
const router = express.Router();
const todosController = require('../controllers/extract_text');

// Create a new Todo
router.post('/', todosController.extractData);

// // Retrieve all Todos
// router.get('/', todosController.getAllTodos);

// // Update a Todo
// router.put('/:id', todosController.updateTodo);

// // Delete a Todo
// router.delete('/:id', todosController.deleteTodo);

module.exports = router;
