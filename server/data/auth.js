let users = [ 
    {
        id: '1628494552174',
        username: 'gyals1479',
        password: '$2b$10$fqYueKDYpjD4JYtbE5lPXer0/s1SZC6bYUrtAazPcaw5rUrtAI2yS',
        name: '김효민2',
        email: 'bs_khm@naver.com',
        url: '',
    }
];

export async function findByUsername(username) {
    return users.find((user) => user.username === username);
}

export async function findById(id) {
      const result = users.find((user) => user.id === id);
      console.log(result , "result!!!!!");
      if(!result){
        console.log(result,'이게뭐야ㅕ');
      }
    return result;
}

export async function createUser(user) {
    const created = { ...user, id: Date.now().toString() };
    users.push(created);
    console.log(users);
    return created.id;
}