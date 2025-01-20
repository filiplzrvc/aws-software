const asyncHandler = require('express-async-handler');

const db = require('../model/db');

// const deleteCar = asyncHandler(async (req, res) => {
//   const { data, code } = await carModel.deleteCar(req.params.id);
//   res.status(code).json(data);
// });

const valid_data = (data) => {
  return !(!data || data == undefined || data == null || data == false);
};

const signup = asyncHandler((req, res) => {
  const { username, password } = req.body;
  const data = db.signup(username, password);
  const valid = valid_data(data);
  if (valid) {
    res.status(201).json(data);
  } else res.status(400).json('Registration failed! User already exists.');
});

const login = asyncHandler((req, res) => {
  const { username, password } = req.body;
  const data = db.login(username, password);
  const valid = valid_data(data);
  if (valid) {
    res.status(201).json(data);
  } else res.status(400).json('Wrong email or password');
});

const isAuthenticated = asyncHandler((req, res) => {
  const { token } = req.body;
  const data = db.isAuthenticated(token);
  const valid = valid_data(data);
  res.status(valid ? 201 : 401).json(data);
});

const addHighscore = asyncHandler((req, res) => {
  const { username, score } = req.body;
  try {
    db.addHighscore(username, score);
    res.status(201).json('Highscore saved');
  } catch (error) {
    res.status(400).json('Could not add highscore');
  }
});

const getHighscores = asyncHandler((req, res) => {
  const data = db.getHighscores();
  if (data.length > 0) {
    res.status(201).json(data);
  } else res.status(204).json('There are no highscores yet!');
});

const endSession = asyncHandler((req, res) => {
  try {
    const token = req.params.token;
    db.deleteToken(token);
    res.status(201);
  } catch (error) {
    res.status(400).json('Something went wrong while logging out!');
  }
});

module.exports = {
  signup,
  login,
  isAuthenticated,
  addHighscore,
  endSession,
  getHighscores,
};
