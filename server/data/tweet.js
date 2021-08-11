/**
 * Model은 데이터를 가지고 있으며, 순수하게 CRUD 기능만을 가지고 있다.
 * 에러 처리, 등의 기능은 Controller에서 작성한다.
 * 
 * 하나의 정보는 한 곳에 있는게 좋다.
 * username,email,등은 userRepository에서 가지고 있으니 userId라는 해당 데이터를 가리키는 키만 가지고있도록 수정한다.
*/ 

import { db } from '../db/database.js';
import * as userRepository from './auth.js';

const SELECT_JOIN = 'SELECT tw.id, tw.text, tw.userId, tw.createdAt, us.username, us.name, us.url FROM tweets as tw JOIN users as us ON tw.userId=us.id';
const ORDER_DESC = 'ORDER BY tw.createdAt DESC';

export async function getAll() {
  return db
  .execute(`${SELECT_JOIN} ${ORDER_DESC}`)
  .then(result => console.log(result[0]));
}

export async function getAllByUsername(username) {
  return db
  .execute( `${SELECT_JOIN} WHERE us.username=? ${ORDER_DESC}`, [ usernmae ] )
  .then(result => console.log(result[0]))
}

export async function getById(id) {
  return db.execute(`${SELECT_JOIN} WHERE tw.id=?`, [ id ]).then(result=> result[0][0]);
}

export async function create(text, userId) {
  return db.execute('INSERT INTO tweet.tweets (text, createdAt, userId) VALUES (?,?,?)', [ text, new Date(), userId ])
  .then(result => getById(result[0].insertId));
}

export async function update(id, text) {
  return db.execute('UPDATE tweets SET text=? WHERE id=?', [ text, id ])
  .then(() => getById(id));
}

export async function remove(id) {
  return db.execute('DELETE FROM tweets WHERE id=?', [ id ]);
}