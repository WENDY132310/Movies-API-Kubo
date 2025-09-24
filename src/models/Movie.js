const db = require('../config/database');

class Movie {
  static async create(movieData) {
    const { title, description, release_date, category_id } = movieData;
    
    const [result] = await db.execute(
      'INSERT INTO movies (title, description, release_date, category_id) VALUES (?, ?, ?, ?)',
      [title, description, release_date, category_id]
    );
    
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT 
        m.*, 
        c.name as category_name 
      FROM movies m 
      JOIN categories c ON m.category_id = c.id 
      WHERE m.id = ?
    `, [id]);
    return rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT 
        m.*, 
        c.name as category_name 
      FROM movies m 
      JOIN categories c ON m.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];
    console.log("QUERY:", query);
    
    console.log("PARAMS:", params);
    
    
    // Filtro por título
    if (filters.title) {
      query += ' AND m.title LIKE ?';
      params.push(`%${filters.title}%`);
    }

    // Filtro por categoría
    if (filters.category) {
      query += ' AND c.name = ?';
      params.push(filters.category);
    }

    // Ordenar por fecha de estreno (más reciente primero)
    query += ' ORDER BY m.release_date DESC';

    // Paginación
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const offset = (page - 1) * limit;
    
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.execute(query, params);
    
    // Contar total para paginación
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM movies m 
      JOIN categories c ON m.category_id = c.id 
      WHERE 1=1
    `;
    const countParams = [];

    if (filters.title) {
      countQuery += ' AND m.title LIKE ?';
      countParams.push(`%${filters.title}%`);
    }

    if (filters.category) {
      countQuery += ' AND c.name = ?';
      countParams.push(filters.category);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    return {
      movies: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getNovelties() {
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
    
    const [rows] = await db.execute(`
      SELECT 
        m.*, 
        c.name as category_name 
      FROM movies m 
      JOIN categories c ON m.category_id = c.id 
      WHERE m.release_date >= ?
      ORDER BY m.release_date DESC
    `, [threeWeeksAgo.toISOString().split('T')[0]]);
    
    return rows;
  }

  static async markAsWatched(userId, movieId) {
    try {
      await db.execute(
        'INSERT INTO user_watched_movies (user_id, movie_id) VALUES (?, ?)',
        [userId, movieId]
      );
      return true;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return false; // Ya fue marcada como vista
      }
      throw error;
    }
  }
}

module.exports = Movie;