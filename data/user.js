import bcrypt from 'bcrypt';

let users = [];

export function find(userId,password) {
    return users.find(user => user.userId === userId && bcrypt.compareSync(password,user.password));
}

export async function join(req) {
    const { userId, password, name, email, url } = req.body;
    const hashed = await bcrypt.hash(password,10);
    console.log(bcrypt.compareSync(password,hashed),'dd?');
    console.log(hashed);
    users = [ { userId, password: hashed, name, email, url }, ...users ];

    console.log(users,'??');
    return users;
}