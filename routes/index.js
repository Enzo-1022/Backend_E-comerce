import express from 'express';
import middlewareRateLimite from '../middlewares/middlewareLimitRate.js';

var router = express.Router();

/* GET home page. */
router.get('/', middlewareRateLimite, function(req, res, next) {
  res.json({ACERTO : "Eu venci!"})
});

export default router;
