// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import 'dotenv/config';
import { Client } from 'twitter-api-sdk';
import { types as tasTypes } from 'twitter-api-sdk';
import fs from 'fs';
import path from 'path';
// const __dirname = path.resolve();

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

  const getTweetsRecursive = async (nextToken?: string) => {
    const tweets = await getTweets(nextToken);
    if (tweets.meta.next_token) {
      appendOutputFile(tweets.data);
      await getTweetsRecursive(tweets.meta.next_token);
    } else {
      appendOutputFile(tweets.data);
    }
  };

  writeOutputFile('[', false);
  await getTweetsRecursive();
  appendOutputFile(']', false);

  // console.log(tweets.meta);
  // console.log(tweets.data.length);
  // console.log(tweets.includes.users[0]);
};

export const fetchFollowers = async <T extends Get2TweetsSearchRecentResponse>(
  tweets: T
) => {
  const distinctUserIds = new Set(tweets.includes.users.map((user) => user.id));

  console.log(distinctUserIds);

  const distinctUsers = await client.users.findUsersById({
    ids: Array.from(distinctUserIds),
    'user.fields': ['location'],
  });

  console.log(distinctUsers);

  console.log(distinctUsers.data[0]);

  //TODO execute in batched parallel loop
  const followers = await client.users.usersIdFollowers(
    distinctUsers.data[0].id,
    {
      max_results: 1000,
    }
  );

  console.log(followers);

  const moreFollowers = await client.users.usersIdFollowers(
    distinctUsers.data[0].id,
    {
      max_results: 1000,
      pagination_token: followers.meta.next_token,
    }
  );

  console.log(moreFollowers);
};

export const writeOutputFile = (tweets: any, isJson = true) => {
  //Ensure the directory exists to write to
  fs.mkdirSync(path.resolve(__dirname, `output/`), {
    recursive: true,
  });

  //Clear all existing files out of the output directory
  fs.rmSync(path.resolve(__dirname, `output/*`), {
    recursive: true,
    force: true,
  });

  //Generate the file
  fs.writeFileSync(
    path.resolve(__dirname, `output/tweetsWithFollowers.json`),
    isJson ? JSON.stringify(tweets) : tweets
  );
};

export const appendOutputFile = (tweets: any, isJson = true) => {
  fs.appendFileSync(
    path.resolve(__dirname, `output/tweetsWithFollowers.json`),
    isJson ? ', ' + JSON.stringify(tweets) : tweets
  );
};
