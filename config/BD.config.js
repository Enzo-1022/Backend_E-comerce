import { Sequelize } from 'sequelize';

import 'dotenv/config';

import logger from './logger.config.js';

const sequelize = new Sequelize('ecomerce2', process.env.UserBD, process.env.DataBasePass, {
    host :  process.env.URLBD,
    dialect : 'mysql',
    port: process.env.BDPORT
});

try {
    await sequelize.authenticate();

    logger.info("MYSQL CONECTADO!");
} catch (error) {
    logger.error({Err : {Titulo : "Erro ao Conectar com o MYSQL!", Detalhes : error}});
    throw new Error(error);
}

export default sequelize;
