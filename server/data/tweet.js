/**
 * Model은 데이터를 가지고 있으며, 순수하게 CRUD 기능만을 가지고 있다.
 * 에러 처리, 등의 기능은 Controller에서 작성한다.
 * 
 * 하나의 정보는 한 곳에 있는게 좋다.
 * username,email,등은 userRepository에서 가지고 있으니 userId라는 해당 데이터를 가리키는 키만 가지고있도록 수정한다.
*/ 

import * as userRepository from './auth.js';

let tweets = [
  {
    id: '1',
    text: '드림코더분들 화이팅!',
    createdAt: new Date().toString(),
    userId: '1628494552174',
  },
  {
    id: '2',
    text: '안뇽!',
    createdAt: new Date().toString(),
    userId: '1628494552174',
  },
];

export async function getAll() {
  return Promise.all(
    tweets.map(async (tweet) => {
      const { username, name, url } = await userRepository.findById(
        tweet.userId
      );
      return { ...tweet, username, name, url };
    })
  );
}

export async function getAllByUsername(username) {
  return getAll().then((tweets) =>
    tweets.filter((tweet) => tweet.username === username)
  );
}

export async function getById(id) {
  const found = tweets.find((tweet) => tweet.id === id);
  if (!found) {
    return null;
  }
  const { username, name, url } = await userRepository.findById(found.userId);
  return { ...found, username, name, url };
}

export async function create(text, userId) {
  const tweet = {
    id: Date.now().toString(),
    text,
    createdAt: new Date(),
    userId,
  };

  tweets = [tweet, ...tweets];

  return getById(tweet.id);
}

export async function update(id, text) {
  const tweet = tweets.find(tweet => tweet.id === id);
  if(tweet) {
    tweet.text = text;
  }
  return getById(tweet.id);
}

export async function remove(id) {
  tweets = tweets.filter(tweet => tweet.id !== id);
}