// const BD = require('../config/BD');

import sequelize from '../config/BD.js';

// const { DataTypes } = require('sequelize');

import { DataTypes } from 'sequelize';

import Usuarios from '../models/mUsuarios.js';

const Logins = sequelize.define(
    'Logins',
    {
        Id_Login : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },

        Id_Usuario : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : Usuarios,
                key : "Id_Usuario"
            }
        },

        Email : {
            type : DataTypes.STRING,
            allowNull : false
        },

        Senha : {
            type : DataTypes.STRING,
            allowNull : false
        },

        Admin : {
            type : DataTypes.BOOLEAN,
            allowNull : true
        }

    },
    {
        timestamps : false,
        freezeTableName : true
    }
);

// console.log(await Logins.sync());

export default Logins;
