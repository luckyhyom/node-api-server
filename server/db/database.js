import config from '../config.js';

import pkg from 'sequelize';
const { Sequelize, DataTypes } = pkg;
const { host, user, database, password } = config.db;

export const dataType = DataTypes;
export const sequelize = new Sequelize( database, user, password, { host, dialect: 'mysql' } );