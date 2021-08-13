/**
 * Model은 데이터를 가지고 있으며, 순수하게 CRUD 기능만을 가지고 있다.
 * 에러 처리, 등의 기능은 Controller에서 작성한다.
 * 
 * 하나의 정보는 한 곳에 있는게 좋다.
 * username,email,등은 userRepository에서 가지고 있으니 userId라는 해당 데이터를 가리키는 키만 가지고있도록 수정한다.
*/ 
import MongoDb from 'mongodb';
import { getTweets } from '../db/database.js';
import * as UserRepository from './auth.js'
const ObjectID = MongoDb.ObjectID;


export async function getAll() {
    return getTweets()
        .find()
        .sort({ createdAt: -1 })
        .toArray()
        .then(mapTweets);
}

export async function getAllByUsername(username) {
    return getTweets()
        .find({ username })
        .sort({ createdAt: -1 })
        .toArray()
        .then(mapTweets);
}

export async function getById(id) {
    return getTweets()
        .find({ _id: new ObjectID(id) })
        .next()
        .then(mapOptionalTweet);
}

export async function create(text, userId) {
    return UserRepository.findById(userId).then(user => 
        getTweets().insertOne({
            text,
            createdAt:new Date(),
            userId,
            name: user.name,
            username: user.username,
            url: user.url,
        })
    )
    .then((result) => result.ops[0])
    .then(mapOptionalTweet);
}

export async function update(id, text) {
    return getTweets().findOneAndUpdate(
        { _id: new ObjectID(id) },
        { $set: { text } },
        { returnOriginal: false },
    )
    .then((result) => result.value)
    .then(mapOptionalTweet);
}

export async function remove(id) {
    return getTweets().deleteOne({ _id: new ObjectID(id) });
}

function mapTweets(tweets) {
    return tweets.map(mapOptionalTweet)
}

function mapOptionalTweet(tweet) {
    return tweet ? { ...tweet, id: tweet._id.toString() } : tweet;
}