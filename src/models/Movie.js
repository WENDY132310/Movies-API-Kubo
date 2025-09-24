const db = require('../config/database');

class Movie {
  static async create(movieData) {
    try {
      const { title, description, release_date, category_id } = movieData;
      
      console.log('Creating movie in DB:', { title, description, release_date, category_id });
      
      const [result] = await db.execute(
        'INSERT INTO movies (title, description, release_date, category_id) VALUES (?, ?, ?, ?)',
        [title, description, release_date, category_id]
      );
      
      return this.findById(result.insertId);
    } catch (error) {
      console.error('Error in Movie.create:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await db.execute(`
        SELECT 
          m.*, 
          c.name as category_name 
        FROM movies m 
        JOIN categories c ON m.category_id = c.id 
        WHERE m.id = ?
      `, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in Movie.findById:', error);
      throw error;
    }
  }

  // src/models/Movie.js - MÉTODO getAll CORREGIDO
static async getAll(filters = {}) {
  try {
    console.log('Movie.getAll called with filters:', filters);
    
    let query = `
      SELECT 
        m.id,
        m.title,
        m.description,
        m.release_date,
        m.category_id,
        m.created_at,
        m.updated_at,
        c.name as category_name 
      FROM movies m 
      JOIN categories c ON m.category_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    // Filtro por título
    if (filters.title && filters.title.trim()) {
      query += ' AND m.title LIKE ?';
      params.push(`%${filters.title.trim()}%`);
      console.log('Added title filter:', filters.title);
    }

    // Filtro por categoría
    if (filters.category && filters.category.trim()) {
      query += ' AND c.name = ?';
      params.push(filters.category.trim());
      console.log('Added category filter:', filters.category);
    }

    // Ordenar por fecha de estreno (más reciente primero)
    query += ' ORDER BY m.release_date DESC';

    // Contar total ANTES de aplicar paginación
    let countQuery = query.replace(
      'SELECT m.id, m.title, m.description, m.release_date, m.category_id, m.created_at, m.updated_at, c.name as category_name',
      'SELECT COUNT(*) as total'
    ).replace('ORDER BY m.release_date DESC', '');

    console.log('Count query:', countQuery);
    console.log('Count params:', params);

    const [countResult] = await db.execute(countQuery, [...params]);
    const total = countResult[0].total;

    // Paginación
    const page = Math.max(1, parseInt(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(filters.limit) || 10));
    const offset = (page - 1) * limit;
    
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    console.log('Final query:', query);
    console.log('Final params:', params);
    console.log('Params types:', params.map(p => typeof p));

    const [rows] = await db.execute(query, params);

    console.log('Movies found:', rows.length);
    console.log('Total count:', total);

    return {
      movies: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error in Movie.getAll:', error);
    console.error('Query that failed:', query);
    console.error('Params that failed:', params);
    throw error;
  }
}

// MÉTODO ALTERNATIVO MÁS SIMPLE (por si el anterior falla)
static async getAllSimple(filters = {}) {
  try {
    console.log('Movie.getAllSimple called with filters:', filters);
    
    // Query base sin parámetros dinámicos
    let query = `
      SELECT 
        m.*,
        c.name as category_name 
      FROM movies m 
      JOIN categories c ON m.category_id = c.id 
    `;
    
    const conditions = [];
    const params = [];

    // Agregar condiciones dinámicamente
    if (filters.title && filters.title.trim()) {
      conditions.push('m.title LIKE ?');
      params.push(`%${filters.title.trim()}%`);
    }

    if (filters.category && filters.category.trim()) {
      conditions.push('c.name = ?');
      params.push(filters.category.trim());
    }

    // Agregar WHERE si hay condiciones
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Ordenar
    query += ' ORDER BY m.release_date DESC';

    // Ejecutar query para contar total
    const countQuery = query.replace('SELECT m.*, c.name as category_name', 'SELECT COUNT(*) as total')
                           .replace('ORDER BY m.release_date DESC', '');
    
    const [countResult] = await db.execute(countQuery, params);
    const total = countResult[0].total;

    // Aplicar paginación
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const offset = (page - 1) * limit;
    
    query += ' LIMIT ' + limit + ' OFFSET ' + offset;

    console.log('Executing query:', query);
    console.log('With params:', params);

    const [rows] = await db.execute(query, params);

    return {
      movies: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  } catch (error) {
    console.error('Error in Movie.getAllSimple:', error);
    throw error;
  }
}

  static async getNovelties() {
    try {
      const threeWeeksAgo = new Date();
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
      
      const threeWeeksAgoStr = threeWeeksAgo.toISOString().split('T')[0];
      
      console.log('Looking for movies released after:', threeWeeksAgoStr);
      
      const [rows] = await db.execute(`
        SELECT 
          m.*, 
          c.name as category_name,
          DATEDIFF(CURDATE(), m.release_date) as days_since_release
        FROM movies m 
        JOIN categories c ON m.category_id = c.id 
        WHERE m.release_date >= ?
        ORDER BY m.release_date DESC
      `, [threeWeeksAgoStr]);
      
      console.log('Novelties found:', rows.length);
      
      return rows;
    } catch (error) {
      console.error('Error in Movie.getNovelties:', error);
      throw error;
    }
  }

  static async markAsWatched(userId, movieId) {
    try {
      console.log('Marking as watched:', { userId, movieId });
      
      await db.execute(
        'INSERT INTO user_watched_movies (user_id, movie_id) VALUES (?, ?)',
        [userId, movieId]
      );
      
      console.log('Movie marked as watched successfully');
      return true;
    } catch (error) {
      console.error('Error in Movie.markAsWatched:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('Movie already marked as watched');
        return false; // Ya fue marcada como vista
      }
      throw error;
    }
  }
}

module.exports = Movie;

