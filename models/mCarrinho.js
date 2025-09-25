import sequelize from '../config/BD.js';

import { DataTypes } from 'sequelize';

import Usuarios from './mUsuarios.js';

import Produtos from './mProdutos.js';

const Carrinho = sequelize.define(
    'Carrinho',
    {
        Id_Carrinho : {
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

        Id_Produto : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : Produtos,
                key : 'Id_Produto'
            }
        }
    },
    {
        timestamps : false,
        freezeTableName : true
    }
);

// console.log(await Carrinho.sync());

export default Carrinho;
