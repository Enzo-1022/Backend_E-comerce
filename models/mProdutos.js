import { DataTypes } from 'sequelize';

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

// console.log(await Produtos.sync());

export default Produtos;
