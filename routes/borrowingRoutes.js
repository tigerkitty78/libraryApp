const express = require('express');
const BorrowingController = require('../controller/borrowingController');
const { authenticateSession } = require('../middleware/auth');

const router = express.Router();

router.post('/borrow', authenticateSession, BorrowingController.borrowBook);
router.delete('/return/:isbn', authenticateSession, BorrowingController.returnBook);
router.get('/borrowed', authenticateSession, BorrowingController.listBorrowedBooks);

module.exports = router;
