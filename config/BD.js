import { Sequelize } from 'sequelize';

import 'dotenv/config'

const sequelize = new Sequelize('ecomerce2', process.env.UserBD, process.env.DataBasePass, {
    host :  process.env.URLBD,
    dialect : 'mysql',
    port: process.env.BDPORT
});

// Adicionar um Log de Erro
try {
    await sequelize.authenticate();

    console.log('MYSQL CONECTADO');
} catch (error) {
    console.error(error);
}

export default sequelize;
