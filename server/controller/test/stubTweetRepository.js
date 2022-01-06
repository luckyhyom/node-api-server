export class StubTweetRepository {
    tweets = [
        {
            id: 1,
            text: "one..",
            username: "효민",
            userId: "효민 아이디"
        },
        {
            id: 2,
            text: "two..",
            username: "짱구",
            userId: "짱구 아이디"
        },
        {
            id: 3,
            text: "three..",
            username: "철수",
            userId: "철수 아이디"
        },
    ];
    id = 3;
    
    getAllByUsername = async (username) => {
        return this.tweets.filter(tweet => tweet.username === username);
    }

    getAll = async () => {
        return this.tweets;
    }

    getById = async (id) => {
        return this.tweets.find(tweet => tweet.id === id);
    }

    create = async (text, userId) => {
        return { id: this.id++, text, userId };
    }

    update = async (id, text) => {
        const tweet = this.tweets.find(tweet => tweet.id === id);
        tweet.text = text;
        return tweet;
    }

    remove = async (id) => {
        this.tweets = this.tweets.filter(tweet => tweet.id !== id);
    }
}