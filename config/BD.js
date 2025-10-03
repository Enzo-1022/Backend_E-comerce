import { Sequelize } from 'sequelize';

import 'dotenv/config'

const sequelize = new Sequelize('ecomerce2', process.env.UserBD, process.env.DataBasePass, {
    host :  process.env.URLBD,
    dialect : 'mysql'
});

// try {
//     await sequelize.authenticate();

//     console.log('Deu certo!')
// } catch (error) {
//     console.log(error)
// }

export default sequelize;
