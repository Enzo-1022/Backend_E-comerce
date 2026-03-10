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
        },

        Ativo : { // Validar
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false // Dps mudar para True
        }

    },
    {
        timestamps : false,
        freezeTableName : true
    }
);

// console.log(await Usuarios.sync())

export default Usuarios;
 