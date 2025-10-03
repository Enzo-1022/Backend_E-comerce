import { DataTypes } from "sequelize";

import sequelize from '../config/BD.js'
import Usuarios from "./mUsuarios.js";

const Sessoes = sequelize.define(
    'Sessoes',
    {
        Id_Sessoes : {
            type: DataTypes.INTEGER,
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
        Token : {
            type : DataTypes.STRING,
            allowNull : false
        }
    },
    {
        timestamps : false,
        freezeTableName : true
    }
);

// await Sessoes.sync();

export default Sessoes;
