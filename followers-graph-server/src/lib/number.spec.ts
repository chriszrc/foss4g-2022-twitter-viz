import test from 'ava';

import { exploreTweets, fixUsersWithFollowers } from './number';

test('exploreTweets', (t) => {
  console.log('here');
  exploreTweets();
  t.pass();
});

test('fixedUsersWithFollowers', (t) => {
  console.log('here');
  fixUsersWithFollowers();
  t.pass();
});

// test('power', (t) => {
//   t.is(power(2, 4), 16);
// });
