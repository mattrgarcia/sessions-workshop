const User = require('./models/User.js');
const db = require('./db.js');

const users = [
  { username: 'moe', password: '123'},
  { username: 'larry', password: '1234'},
  { username: 'curly', password: '12345'},
];

const syncAndSeed = () => db
  .sync({ force: true })
  .then(() => {
    users.map(user=> User.create(user))
    return true;
  })
  .catch(e => {
    console.error(e);
  });

module.exports = {
  models: {
    User,
  },
  db,
  syncAndSeed,
};
