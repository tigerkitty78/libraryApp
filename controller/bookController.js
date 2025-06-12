const BookService = require('../service/bookService');

class BooksController {
  static async createBooks(req, res) {
    try {
      const { books } = req.body;
      if (!books || !Array.isArray(books) || books.length === 0) {
        return res.status(400).json({ error: 'Invalid or missing books array' });
      }

      // Validate required fields for each book (e.g., isbn, title, author)
      for (const book of books) {
        if (!book.isbn || !book.title || !book.author) {
          return res.status(400).json({ error: 'isbn, title, and author are required for each book' });
        }
      }

      const createdBooks = await BookService.createBooks(books);
      res.status(201).json(createdBooks);
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(400).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async listBooks(req, res) {
    try {
      const page = parseInt(req.query.page) || 0;
      if (page < 0) return res.status(400).json({ error: 'Invalid page number' });

      const data = await BookService.listBooks(page);
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async updateBook(req, res) {
    try {
      const isbn = req.params.isbn;
      const updateData = req.body;

      // ISBN in path must match ISBN in body if provided
      if (updateData.isbn && updateData.isbn !== isbn) {
        return res.status(400).json({ error: 'ISBN in URL and body do not match' });
      }

      // Remove isbn from updateData to prevent primary key changes
      delete updateData.isbn;

      const updated = await BookService.updateBook(isbn, updateData);
      res.status(200).json(updated);
    } catch (error) {
      if (error.message === 'Book not found') {
        return res.status(400).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async deleteBook(req, res) {
    try {
      const isbn = req.params.isbn;
      await BookService.deleteBook(isbn);
      res.status(204).send();
    } catch (error) {
      if (error.message === 'Book not found') {
        return res.status(400).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = BooksController;
