import tweets from '../data/tweets.json';
import users from '../data/users.json';
import usersWithFollowers from '../data/usersWithFollowers_old.json';
import { writeOutputFile } from './async';

export const exploreTweets = () => {
  console.log(tweets.length);

  // const tweets = tweetsWithFollowers.tweets;
  // const followers = tweetsWithFollowers.followers;
  // const result = {};
  // tweets.forEach(tweet=>{
  //     const tweetId = tweet.id;
  //     const tweetFollowers = followers.filter(follower=>follower.tweetId === tweetId);
  //     result[tweetId] = tweetFollowers.length;
  // } );
  // return result;
};

export const fixUsersWithFollowers = () => {
  const usersFlat = users.flat();
  // console.log(usersFlat.length);
  // const idx = usersFlat.findIndex((u) => u.username === 'SimonBergmeier');
  // console.log(idx);
  const uniqueUserIds = new Set(usersFlat.map((u) => u.id));

  const fixedUsersWithFollowers = [];

  const usersWithFollowersArr = usersWithFollowers as any[];

  console.log('here');

  usersWithFollowersArr.forEach((user) => {
    const fixedUser = {
      ...user,
      followerCount: user.followers.length,
      followers: user.followers.filter((f) => uniqueUserIds.has(f.id)),
    };
    fixedUsersWithFollowers.push(fixedUser);
  });

  writeOutputFile('usersWithFollowers.json', fixedUsersWithFollowers);

  // console.log('lenght=' + fixedUsersWithFollowers.length);
};
