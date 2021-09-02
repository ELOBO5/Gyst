const { Pool } = require("pg");

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

const pool = (() => {
  if ((process.env.NODE_ENV === 'development') || (process.env.NODE_ENV === 'test')) {
      return new Pool();
  } else {
      return new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: {
              rejectUnauthorized: false
            }
      });
  } })();

module.exports = pool;
