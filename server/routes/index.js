const express = require('express');
const {
  signup,
  login,
  isAuthenticated,
  addHighscore,
  endSession,
  getHighscores,
} = require('../controllers');

const router = express.Router();

router.get('/highscore', getHighscores);

router.post('/highscore', addHighscore);
router.post('/users', signup);
router.post('/sessions', login);
router.post('/authenticate', isAuthenticated);

router.delete('/sessions/:token', endSession);

module.exports = router;
