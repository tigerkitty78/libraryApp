const express = require('express');
const BookController = require('../controller/bookController');
const { authenticateSession, authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/books', authenticateAdmin, BookController.createBooks);
router.get('/books', authenticateSession, BookController.listBooks);
router.put('/books/:isbn', authenticateAdmin, BookController.updateBook);
router.delete('/books/:isbn', authenticateAdmin, BookController.deleteBook);

module.exports = router;