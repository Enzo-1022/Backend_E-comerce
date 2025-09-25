import { DataTypes } from "sequelize";

import sequelize from '../config/BD.js';

import Usuarios from './mUsuarios.js';

import Produtos from './mProdutos.js';

const Compras = sequelize.define(
    'Compras',
    {
        Id_Compra : {
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

        Quantidade : {
            type : DataTypes.INTEGER,
            allowNull : false
        },

        Data : {
            type : DataTypes.DATEONLY,
            allowNull : false
        },

        Status : {
            type : DataTypes.STRING
        }
    },
    {
        timestamps : false,
        freezeTableName : true
    }
);

// console.log(await Compras.sync());

export default Compras;
