// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import 'dotenv/config';
import { Client } from 'twitter-api-sdk';
import { types as tasTypes } from 'twitter-api-sdk';
import fs from 'fs';
import path from 'path';
// const __dirname = path.resolve();

import tweetsJson from '../data/tweets.json';
import usersJson from '../data/users.json';

//TODO this is bulllllllshhiiiiittttt - https://github.com/microsoft/TypeScript/issues/13135
// import TwitterPaginatedResponse = tasTypes.TwitterPaginatedResponse;
// import TwitterResponse = tasTypes.TwitterResponse;
// import tweetsRecentSearch = tasTypes.tweetsRecentSearch;
import components = tasTypes.components;
//TODO why cant i get this type from components @#^&^$%#$#@!
interface Get2TweetsSearchRecentResponse {
  data?: components['schemas']['Tweet'][];
  errors?: components['schemas']['Problem'][];
  includes?: components['schemas']['Expansions'];
  meta?: {
    newest_id?: components['schemas']['NewestId'];
    next_token?: components['schemas']['NextToken'];
    oldest_id?: components['schemas']['OldestId'];
    result_count?: components['schemas']['ResultCount'];
  };
}

//twitter client
const client = new Client(process.env.TWITTER_API_BEARER_TOKEN);

/**
 *
 */
export const fetchTweets = async () => {
  const getTweets = async (nextToken: string) => {
    const tweets = await client.tweets.tweetsRecentSearch({
      query: '#foss4g2022',
      max_results: 100,
      start_time: '2022-08-22T00:00:00Z',
      expansions: ['author_id'],
      ...(nextToken ? { next_token: nextToken } : {}),
    });
    console.log(tweets.data.length);
    console.log(tweets.meta);
    return tweets;
  };

  //NOTE about 5400 tweets
  const getTweetsRecursive = async (nextToken?: string) => {
    const tweets = await getTweets(nextToken);
    if (tweets.meta.next_token) {
      appendOutputFile('tweetsWithFollowers.json', tweets.data);
      await getTweetsRecursive(tweets.meta.next_token);
    } else {
      appendOutputFile('tweetsWithFollowers.json', tweets.data);
    }
  };

  writeOutputFile('tweetsWithFollowers.json', '[', false);
  await getTweetsRecursive();
  appendOutputFile('tweetsWithFollowers.json', ']', false);

  // console.log(tweets.meta);
  // console.log(tweets.data.length);
  // console.log(tweets.includes.users[0]);
  //NOTE then I added the "tweetsWithFollowers.json" file manually to the /data folder, i know, cheating
};

export const fetchUsers = async <T extends Get2TweetsSearchRecentResponse>(
  tweets?: T
) => {
  //NOTE about 1300 distinct users
  const distinctUserIds = new Set(
    tweetsJson.map((ta) => ta.map((t) => t.author_id)).flat()
  );

  console.log(distinctUserIds);
  console.log(distinctUserIds.size);

  const userIdBatch = [];

  writeOutputFile('users.json', '[', false);

  for (const userId of distinctUserIds) {
    userIdBatch.push(userId);

    if (userIdBatch.length === 99) {
      const distinctUsers = await client.users.findUsersById({
        ids: userIdBatch,
        'user.fields': ['location', 'profile_image_url'],
      });

      console.log(distinctUsers.data.length);

      appendOutputFile('users.json', distinctUsers.data);

      //reset the batch
      userIdBatch.length = 0;
    }
  }

  appendOutputFile('users.json', ']', false);
};

/**
 *
 */
export const fetchFollowers = async () => {
  const followersBatch = [] as any[][];

  const getFollowers = async (userId: string, nextToken: string) => {
    const followers = await client.users.usersIdFollowers(userId, {
      max_results: 1000,
      ...(nextToken ? { pagination_token: nextToken } : {}),
    });
    console.log(followers?.data?.length);
    console.log(followers?.meta);
    return followers;
  };

  //NOTE
  const getFollowersRecursive = async (userId: string, nextToken?: string) => {
    const followers = await getFollowers(userId, nextToken);
    if (followers.meta.next_token) {
      followersBatch.push(followers.data);
      await new Promise((resolve) => setTimeout(resolve, 61000));
      await getFollowersRecursive(userId, followers.meta.next_token);
    } else {
      if (followers?.data && followers.data.length > 0) {
        followersBatch.push(followers.data);
      }
    }
  };

  writeOutputFile('usersWithFollowers.json', '[', false);

  const users = usersJson.flat();
  //NOTE had to start from ~300th users because script bombed :(
  const idx = users.findIndex((u) => u.id === '1371849749855363080');
  const usersSlice = users.slice(idx + 1);
  const userIds = new Set(usersSlice.map((u) => u.id));

  for (const user of usersSlice) {
    console.log(user.username);
    await getFollowersRecursive(user.id);
    const followersBatchFlat = followersBatch.flat();
    appendOutputFile('usersWithFollowers.json', {
      ...user,
      followers_count: followersBatchFlat.length,
      followers:
        followersBatchFlat.length !== 0
          ? followersBatchFlat.filter((f) => userIds.has(f?.id))
          : [],
    });
    followersBatch.length = 0;
    await new Promise((resolve) => setTimeout(resolve, 61000));
  }

  appendOutputFile('usersWithFollowers.json', ']', false);
};

export const writeOutputFile = (
  fileName: string,
  tweets: any,
  isJson = true
) => {
  //Clear all the file if it exists
  fs.rmSync(path.resolve(__dirname, `output/${fileName}`), {
    force: true,
  });

  //Ensure the directory exists to write to
  fs.mkdirSync(path.resolve(__dirname, `output/`), {
    recursive: true,
  });

  //Generate the file
  fs.writeFileSync(
    path.resolve(__dirname, `output/${fileName}`),
    isJson ? JSON.stringify(tweets) : tweets
  );
};

export const appendOutputFile = (
  fileName: string,
  tweets: any,
  isJson = true
) => {
  fs.appendFileSync(
    path.resolve(__dirname, `output/${fileName}`),
    isJson ? ', ' + JSON.stringify(tweets) : tweets
  );
};
