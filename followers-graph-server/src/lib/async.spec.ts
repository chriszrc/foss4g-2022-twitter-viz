import test from 'ava';

import { appendOutputFile, fetchTweets, writeOutputFile } from './async';

// test('getABC', async (t) => {
//   t.deepEqual(await asyncABC(), ['a', 'b', 'c']);
// });

// test('fetchTweets', async (t) => {
//   t.timeout(100000);
//   await fetchTweets();
//   t.pass();
// });

test('fs path', async (t) => {
  writeOutputFile(['a', 'b', 'c']);
  appendOutputFile(['a', 'b', 'c']);
  t.pass();
});
