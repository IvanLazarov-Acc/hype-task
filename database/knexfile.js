// Update with your config settings.
require("dotenv/config");
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */


module.exports = {

  
  development: {
    client: 'postgres',
    connection: {
      host :process.env.DB_HOST,
      port : process.env.DB_PORT,
      database: 'pagila',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: 'my_db',
  //     user:     'username',
  //     password: 'password'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
