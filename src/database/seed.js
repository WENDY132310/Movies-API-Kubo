const db = require('../config/database');

async function seed() {
  try {
    console.log('Starting database seeding...');
    
    // Verificar si ya existen las categorías
    const [existingCategories] = await db.execute('SELECT COUNT(*) as count FROM categories');
    
    if (existingCategories[0].count === 0) {
      // Insertar categorías por defecto
      await db.execute(`
        INSERT INTO categories (name) VALUES 
        ('Terror'),
        ('Suspenso'),
        ('Drama'),
        ('Comedia')
      `);
      console.log('Categories seeded successfully');
    } else {
      console.log('Categories already exist, skipping seed');
    }
    
    // Opcionalmente, insertar algunas películas de ejemplo
    const [existingMovies] = await db.execute('SELECT COUNT(*) as count FROM movies');
    
    if (existingMovies[0].count === 0) {
      await db.execute(`
        INSERT INTO movies (title, description, release_date, category_id) VALUES 
        ('El Conjuro', 'Una familia se muda a una casa embrujada', '2023-10-01', 1),
        ('Hereditary', 'Horror psicológico sobre una familia disfuncional', '2023-11-15', 1),
        ('Shutter Island', 'Un detective investiga en un hospital psiquiátrico', '2023-09-20', 2),
        ('Gone Girl', 'Un hombre busca a su esposa desaparecida', '2023-12-01', 2),
        ('Parasite', 'Drama sobre desigualdad social', '2023-08-10', 3),
        ('The Pursuit of Happyness', 'Un padre lucha por salir adelante', '2023-07-15', 3),
        ('Superbad', 'Comedia sobre adolescentes en su último año', '2023-12-10', 4),
        ('The Grand Budapest Hotel', 'Comedia sobre un hotel europeo', '2023-11-30', 4)
      `);
      console.log('Sample movies seeded successfully');
    }
    
    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();