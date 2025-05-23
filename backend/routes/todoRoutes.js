const express = require('express');
const router = express.Router();
const {
  getTodos, addTodo, deleteTodo, updateTodo, summarizeTodos
} = require('../controllers/todoController');

router.get('/todos', getTodos);
router.post('/todos', addTodo);
router.delete('/todos/:id', deleteTodo);
router.put('/todos/:id', updateTodo);
router.post('/summarize', summarizeTodos);

module.exports = router;

