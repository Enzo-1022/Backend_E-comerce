import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('ecomerce2', 'root', '', {
    host : 'localhost',
    dialect : 'mysql'
});

export default sequelize;
