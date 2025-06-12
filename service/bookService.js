const Book = require('../models/Book');

class BookService {
  static async createBooks(bookList) {
    // Delegate directly to the Book model's method
    const result = await Book.create(bookList);

    if (result.error) {
      throw new Error(result.error);
    }

    return result.books;
  }

  static async listBooks(page = 0, limit = 10) {
    const offset = page * limit;

    const { count, rows } = await Book.findAndCountAll({
      order: [['isbn', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      total_pages: totalPages,
      page,
      books: rows,
    };
  }

  static async updateBook(isbn, updateData) {
    const transaction = await sequelize.transaction();
    try {
      const book = await Book.findByPk(isbn, { transaction });
      if (!book) {
        throw new Error('Book not found');
      }

      updateData.updated_at = new Date();

      await book.update(updateData, { transaction });
      await transaction.commit();

      return { isbn: book.isbn, updated_at: book.updated_at };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deleteBook(isbn) {
    const transaction = await sequelize.transaction();
    try {
      const book = await Book.findByPk(isbn, { transaction });
      if (!book) {
        throw new Error('Book not found');
      }

      await book.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = BookService;
