const BorrowingService = require('../service/borrowingService');

class BorrowingController {
  static async borrowBook(req, res) {
    try {
      const username = req.user.username;
      const { isbn } = req.body;

      const result = await BorrowingService.borrowBook(username, isbn);
      res.status(200).json(result);
    } catch (error) {
      if (error.message === 'Book already borrowed by this user' || error.message === 'Borrow limit exceeded' || error.message === 'ISBN is required') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error borrowing book:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async returnBook(req, res) {
    try {
      const username = req.user.username;
      const { isbn } = req.params;

      await BorrowingService.returnBook(username, isbn);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'No active borrowing found for this book and user' || error.message === 'ISBN is required') {
        return res.status(400).json({ error: error.message });
      }
      console.error('Error returning book:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async listBorrowedBooks(req, res) {
    try {
      const username = req.user.username;
      const books = await BorrowingService.listBorrowedBooks(username);
      res.status(200).json({ books });
    } catch (error) {
      console.error('Error listing borrowed books:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = BorrowingController;
