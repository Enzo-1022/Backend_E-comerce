import { Sequelize } from 'sequelize';

import 'dotenv/config'

const sequelize = new Sequelize('ecomerce2', process.env.UserBD, process.env.DataBasePass, {
    host :  process.env.URLBD,
    dialect : 'mysql',
    port: process.env.BDPORT
});

// try {
//     await sequelize.authenticate();

//     console.log('Deu certo!')
// } catch (error) {
//     console.log(error)
// }

export default sequelize;
