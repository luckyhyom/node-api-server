import { sequelize } from '../db/database.js';
import pkg from 'sequelize';
const { DataTypes } = pkg;

export const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(45),
        allowNull:  false,
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    url: {
        type: DataTypes.TEXT
    }
  }, {
});


export async function findByUsername(username) {
    return User.findOne({ where: { username } });
}

export async function findById(id) {
    return User.findByPk(id);
}

export async function createUser(user) {
    return User.create(user).then(data => {console.log(data); return data.dataValues.id});
}