// const { DataTypes } = require('sequelize');

import { DataTypes } from 'sequelize';

// const BD = require('../config/BD');

import sequelize from '../config/BD.js'

const Produtos = sequelize.define(
    'Produtos',
    {
        Id_Produto : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },

        Nome : {
            type : DataTypes.STRING,
            allowNull : false
        },

        Descricao : {
            type : DataTypes.STRING,
            allowNull : false
        },

        Quantidade : {
            type : DataTypes.INTEGER,
            allowNull : false
        },

        Preco : {
            type : DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps : false,
        freezeTableName : true
    }
);

// module.exports = Produtos;

// console.log(await Produtos.sync());

export default Produtos;
