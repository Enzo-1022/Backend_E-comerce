import express from "express";
import middlewareRateLimite from "../middlewares/middlewareLimitRate.js";

var router = express.Router();

/* GET home page. */
router.get('/', middlewareRateLimite, function(req, res, next) {
  // req.log.error("Teste");
  req.log.info({err : "Teste"})
  res.status(200).json({ACERTO : "Eu venci!"})
});

export default router;
