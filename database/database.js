const knex = require("knex");
const knexfile = require("./knexfile");

const dbConnection = knex(knexfile.development);

dbConnection.raw("SELECT 1").then(() => {
    console.log("PostgreSQL connected");
})
.catch((e) => {
    console.log("PostgreSQL not connected");
    console.error(e);
});

module.exports = dbConnection;