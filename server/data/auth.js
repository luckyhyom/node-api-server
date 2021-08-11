import {db} from '../db/database.js';

export async function findByUsername(username) {
    return users.find((user) => user.username === username);
}

export async function findById(id) {
      const result = users.find((user) => user.id === id);
    return result;
}

export async function createUser(user) {
    const {username, password, name, email, url} = user;
    return db.excute(
        'INSERT INTO users (username, password, name, email, url) VALUES (?,?,?,?,?)',
        [username, password, name, email, url]
    )
    .then((result) => {
        console.log(result);
        return result;
    })
}