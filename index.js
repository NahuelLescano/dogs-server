const server = require('./src/app.js');
// const {
//   getTemperaments,
// } = require('./src/controllers/temperamentController.js');
const { conn } = require('./src/db.js');
const { PORT } = process.env;

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  // getTemperaments();
  console.log('Connecting to the database');
  server.listen(PORT, () => {
    console.log(`Listening at port: ${PORT}`);
  });
});
