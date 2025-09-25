import { DataTypes } from "sequelize";

import sequelize from "../config/BD.js";

import Usuarios from "./mUsuarios.js";

const Cartoes = sequelize.define(
    'Cartoes',
    {
        Id_Cartao : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },

        Id_Usuario : {
            type : DataTypes.INTEGER,
            references : {
                model : Usuarios,
                key : "Id_Usuario"
            }
        },

        Numero : {
            type : DataTypes.STRING,
            allowNull : false
        },

        Cvv : {
            type : DataTypes.STRING,
            allowNull : false
        },

        Vencimento : {
            type : DataTypes.STRING,
            allowNull : false
        }

    },
    {
        timestamps : false,
        freezeTableName : true
    }
);

// console.log(await Cartoes.sync());

export default Cartoes;
