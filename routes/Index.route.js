import express from "express";
import middlewareRateLimite from "../middlewares/LimitRate.middleware.js";

var router = express.Router();

/* GET home page. */
router.get('/', middlewareRateLimite, function(req, res, next) {
  res.status(200).json({Funciona : true});
});

export default router;
