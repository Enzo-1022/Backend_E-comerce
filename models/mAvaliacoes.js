import { DataTypes } from "sequelize";

import sequelize from '../config/BD.js';

import Usuarios from './mUsuarios.js';

import Produtos from './mProdutos.js';

const Avaliacoes = sequelize.define(
    'Avaliacoes',
    {
        Id_Avaliacao : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },

        Id_Usuario : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : Usuarios,
                key : 'Id_Usuario'
            }
        },

        Id_Produto : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : Produtos,
                key : 'Id_Produto'
            }
        },

        Nota : {
            type : DataTypes.INTEGER,
            allowNull : false
        },

        Avaliacao : {
            type : DataTypes.STRING,
        }
    },
    {
        timestamps : false,
        freezeTableName : true
    }
);

// console.log(await Avaliacoes.sync());

export default Avaliacoes;
