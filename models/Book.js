const { pool } = require('../config/database');

class Book {
  static async create(booksData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const createdBooks = [];
      const existingIsbns = [];

      // Check for existing ISBNs
      for (const bookData of booksData) {
        const [existing] = await connection.execute(
          'SELECT isbn FROM books WHERE isbn = ?',
          [bookData.isbn]
        );

        if (existing.length > 0) {
          existingIsbns.push(bookData.isbn);
        }
      }

      if (existingIsbns.length > 0) {
        await connection.rollback();
        return { error: `Books with ISBNs already exist: ${existingIsbns.join(', ')}`, statusCode: 400 };
      }

      // Insert books
      for (const bookData of booksData) {
        const [result] = await connection.execute(`
          INSERT INTO books (isbn, title, author, edition, publisher, genre, page_count, language, publication_year)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          bookData.isbn,
          bookData.title,
          bookData.author,
          bookData.edition || null,
          bookData.publisher || null,
          bookData.genre || null,
          bookData.page_count || null,
          bookData.language || null,
          bookData.publication_year || null
        ]);

        // Get the created book with timestamp
        const [createdBook] = await connection.execute(
          'SELECT isbn, added_at FROM books WHERE isbn = ?',
          [bookData.isbn]
        );

        createdBooks.push({
          isbn: createdBook[0].isbn,
          added_at: createdBook[0].added_at.toISOString().replace('.000Z', 'Z')
        });
      }

      await connection.commit();
      return { success: true, books: createdBooks };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findAll(page = 0, limit = 10) {
    try {
      const offset = page * limit;

      // Get total count
      const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM books');
      const totalBooks = countResult[0].total;
      const totalPages = Math.ceil(totalBooks / limit);

      // Get books with pagination, sorted by ISBN descending
      const [rows] = await pool.execute(`
        SELECT isbn, title, author, edition, publisher, genre, page_count, language, publication_year, added_at, updated_at
        FROM books 
        ORDER BY isbn DESC
        LIMIT ? OFFSET ?
      `, [limit, offset]);

      const books = rows.map(book => ({
        ...book,
        added_at: book.added_at ? book.added_at.toISOString().replace('.000Z', 'Z') : null,
        updated_at: book.updated_at ? book.updated_at.toISOString().replace('.000Z', 'Z') : null
      }));

      return {
        total_pages: totalPages,
        page: page,
        books: books
      };
    } catch (error) {
      throw error;
    }
  }

  static async findByIsbn(isbn) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM books WHERE isbn = ?',
        [isbn]
      );
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  static async updateByIsbn(isbn, bookData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if book exists
      const [existing] = await connection.execute(
        'SELECT isbn FROM books WHERE isbn = ?',
        [isbn]
      );

      if (existing.length === 0) {
        await connection.rollback();
        return { error: 'Book not found', statusCode: 400 };
      }

      // Update book
      await connection.execute(`
        UPDATE books 
        SET title = ?, author = ?, edition = ?, publisher = ?, genre = ?, 
            page_count = ?, language = ?, publication_year = ?, updated_at = NOW()
        WHERE isbn = ?
      `, [
        bookData.title,
        bookData.author,
        bookData.edition || null,
        bookData.publisher || null,
        bookData.genre || null,
        bookData.page_count || null,
        bookData.language || null,
        bookData.publication_year || null,
        isbn
      ]);

      // Get updated timestamp
      const [updatedBook] = await connection.execute(
        'SELECT isbn, updated_at FROM books WHERE isbn = ?',
        [isbn]
      );

      await connection.commit();
      return { 
        success: true, 
        book: {
          isbn: updatedBook[0].isbn,
          updated_at: updatedBook[0].updated_at.toISOString().replace('.000Z', 'Z')
        }
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async deleteByIsbn(isbn) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if book exists
      const [existing] = await connection.execute(
        'SELECT isbn FROM books WHERE isbn = ?',
        [isbn]
      );

      if (existing.length === 0) {
        await connection.rollback();
        return { error: 'Book not found', statusCode: 400 };
      }

      // Delete book
      await connection.execute('DELETE FROM books WHERE isbn = ?', [isbn]);

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Book;