const borrowingModel = require('../models/Borrowing');

class BorrowingService {
  static async borrowBook(username, isbn) {
    // Check if the book is already borrowed
    const borrowings = await borrowingModel.getUserBorrowings(username);
    const isBookBorrowed = borrowings.some(b => b.isbn === isbn && b.returned_at === null);

    if (isBookBorrowed) {
      throw new Error('Book already borrowed by this user');
    }

    // Count how many active borrowings the user has
    const activeBorrowings = borrowings.filter(b => b.returned_at === null);

    if (activeBorrowings.length >= 2) {
      throw new Error('Borrow limit exceeded');
    }

    // Add new borrowing
    const insertId = await borrowingModel.addBorrowing(username, isbn);
    return {
      isbn,
      borrowed_at: new Date().toISOString(),
    };
  }

  static async returnBook(username, isbn) {
    const borrowings = await borrowingModel.getUserBorrowings(username);
    const borrowing = borrowings.find(b => b.isbn === isbn && b.returned_at === null);

    if (!borrowing) {
      throw new Error('No active borrowing found for this book and user');
    }

    await borrowingModel.returnBook(borrowing.id);
  }

  static async listBorrowedBooks(username) {
    const borrowings = await borrowingModel.getUserBorrowings(username);
    return borrowings.map(b => ({
      isbn: b.isbn,
      borrowed_at: b.borrowed_at.toISOString(),
      returned_at: b.returned_at ? b.returned_at.toISOString() : null,
    }));
  }
}

module.exports = BorrowingService;
