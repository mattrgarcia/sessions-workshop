const path = require('path');
const express = require('express');
const chalk = require('chalk');
const { syncAndSeed, models } = require('./db/index.js');
const {User} = models;
const session = require('express-session');

const PORT = 3000;

// DONT WORRY ABOUT THIS, ITS TO HELP YA!
// Due to recent bug in nodemon, this will make sure it restarts without errors.
// If you see red text saying the port is already being used...
// lsof -i :3000
// kill ${the pid you see from the last command}
process.on('uncaughtException', (e) => {
  console.log(chalk.red(e.message));
  process.exit(0);
});

const app = express();

const STATIC_DIR = path.join(__dirname, '../static');

app.use(express.json());
app.use(express.static(STATIC_DIR));

// simple logging middleware to view each request in your terminal - this is useful for debugging purposes
app.use((req, res, next) => {
  console.log(`Request to ${req.path} - Body: `, req.body);
  next();
});

app.use(session({
  secret: 'super secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
app.post('/api/login', (req, res, next) => {
  const { username, password } = req.body;
    User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    })
    .then(user=> {
      if(!user){
        res.status(401).send({message:'You are unauthorized'})
      }
      req.session.user = user
      return res.status(200).send(user);
    })
    .catch(err => next(err))


  // TODO: This obviously isn't all we should do...

  // You can toggle this to see how the app behaves if an error goes down...
  // res.status(401).send({ message: 'You are unauthorized!' });
});

app.delete('/api/logout', (req, res, next) => {
  // TODO: Build this functionality.
  req.session.destroy()
  res.status(204).send("user is now logged out");
  next();
});
/*
app.get("/api/sessions", (req, res, next) => {
  const user = req.session.user;
  if (user) {
    return res.send(user);
  }
  next({ status: 401, message: "user is not logged in" });
});

app.delete("/api/sessions", (req, res, next) => {
  req.session.destroy();
  res.status(204).send("user is now logged out");
});
*/
app.get('*', (req, res) => res.sendFile(path.join(STATIC_DIR, './index.html')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ err });
});

syncAndSeed()
  .then(() => {
    app.listen(PORT, () => {
      console.log(chalk.greenBright(`App now listening on http://localhost:${PORT}`));
    });
  });
