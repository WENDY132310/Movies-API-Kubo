const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    try {
      console.log('User.create called with:', userData); // Debug log
      
      const { username, email, password } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      
      const newUser = { id: result.insertId, username, email };
      console.log('User created in DB:', newUser); // Debug log
      
      return newUser;
    } catch (error) {
      console.error('Error in User.create:', error); // Debug log
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT id, username, email, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in User.findById:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in User.findByEmail:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.execute(
        'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error in User.getAll:', error);
      throw error;
    }
  }

  static async getUsersWithWatchedMovies() {
    try {
      const [rows] = await db.execute(`
        SELECT 
          u.id as user_id,
          u.username,
          u.email,
          u.created_at,
          COUNT(uwm.movie_id) as watched_count,
          GROUP_CONCAT(
            JSON_OBJECT(
              'movie_id', m.id,
              'title', m.title,
              'category', c.name,
              'watched_at', uwm.watched_at
            )
          ) as watched_movies
        FROM users u
        LEFT JOIN user_watched_movies uwm ON u.id = uwm.user_id
        LEFT JOIN movies m ON uwm.movie_id = m.id
        LEFT JOIN categories c ON m.category_id = c.id
        GROUP BY u.id, u.username, u.email, u.created_at
        ORDER BY u.created_at DESC
      `);
      
      return rows.map(row => ({
        user_id: row.user_id,
        username: row.username,
        email: row.email,
        created_at: row.created_at,
        watched_count: row.watched_count,
        watched_movies: row.watched_movies ? 
          JSON.parse(`[${row.watched_movies}]`) : []
      }));
    } catch (error) {
      console.error('Error in User.getUsersWithWatchedMovies:', error);
      throw error;
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error in User.validatePassword:', error);
      throw error;
    }
  }
}

module.exports = User;