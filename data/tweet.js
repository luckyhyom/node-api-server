/**
 * Model은 데이터를 가지고 있으며, 순수하게 CRUD 기능만을 가지고 있다.
 * 에러 처리, 등의 기능은 Controller에서 작성한다.
*/ 

let tweets = [
    {
      id: '1',
      text: '드림코더분들 화이팅!',
      createdAt: Date.now().toString(),
      name: 'Bob',
      username: 'bob',
      url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
    },
    {
      id: '2',
      text: '안뇽!',
      createdAt: Date.now().toString(),
      name: 'Ellie',
      username: 'ellie',
    },
  ];

export async function getAll() {
    return tweets;
}

export async function getByUsername(username) {
  return tweets.filter(tweet => tweet.username === username);
}

export async function getById(id) {
  return tweets.find(tweet => tweet.id === id);
}

export async function create(name,username,text) {
  const tweet = {
    id: Date.now().toString(),
    text,
    createdAt: new Date(),
    name,
    username,
  };

  tweets = [tweet, ...tweets];

  return tweet;
}

// *수정은 되지만 값은 비어있다.
export async function update(id, text) {
  const tweet = tweets.find(tweet => tweet.id === id);
  if(tweet) {
    tweet.text = text;
  }
  return tweet;
}

export async function remove(id) {
  tweets = tweets.filter(tweet => tweet.id !== id);
}