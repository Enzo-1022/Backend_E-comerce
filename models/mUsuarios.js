import sequelize from '../config/BD.js';

import { DataTypes } from 'sequelize';

const Usuarios = sequelize.define(
    'Usuarios',
    {
        Id_Usuario : {
            type: DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true,
        },

        Nome: {
            type : DataTypes.STRING,
            allowNull : false 
        },

        Data_Nascimento : {
            type : DataTypes.DATEONLY,
            allowNull : false
        },

        Cpf : {
            type : DataTypes.STRING,
            allowNull : false
        }
    },
    {
        timestamps : false,
        freezeTableName : true
    }
);

// console.log(await Usuarios.sync({alter: true}))

export default Usuarios;
 