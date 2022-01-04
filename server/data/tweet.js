import { sequelize, dataType } from '../db/database.js';
import { User } from './auth.js';

import pkg from 'sequelize';
const { Sequelize } = pkg;

const Tweet = sequelize.define('Tweet', {
  id: {
    type: dataType.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  text: {
    type: dataType.TEXT,
    allowNull: false,
  },
});

Tweet.belongsTo(User);

const INCLUDE_UER = {
    attributes: [
        'id',
        'text',
        'userId',
        'createdAt',
        [Sequelize.col('user.username'),'username'],
        [Sequelize.col('user.name'),'name'],
        [Sequelize.col('user.url'),'url'],
    ],
    include: {
        model: User,
        attributes: [],
    },
};

const ORDER_DESC = {
    order: [['createdAt', 'DESC']],
}

export async function getAll() {
    return Tweet.findAll({ ...INCLUDE_UER, ...ORDER_DESC });
}

export async function getAllByUsername(username) {
    return Tweet.findAll({
        ...INCLUDE_UER,
        ...ORDER_DESC,
        include: {
            ...INCLUDE_UER.include,
            where: { username },
        },
    });
}

export async function getById(id) {
    return Tweet.findOne({
        ...INCLUDE_UER,
        where: { id },
    });
}

export async function create(text, userId) {
    return Tweet.create({ text, userId })
        .then((data) => {
            getById(data.dataValues.id)
        });
}

export async function update(id, text) {
    return Tweet.findByPk(id, INCLUDE_UER)
        .then(tweet => {
            tweet.text = text;
            return tweet.save();
        })
}

export async function remove(id) {
  return Tweet.findByPk(id)
    .then((tweet) => {
        tweet.destroy()
    });
}