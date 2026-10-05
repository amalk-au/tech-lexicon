export function minCoins(coins, amount) {
  if (!Number.isSafeInteger(amount) || amount < 0 ||
      coins.some(coin => !Number.isSafeInteger(coin) || coin <= 0)) {
    throw new RangeError("Use positive integer coins and a non-negative integer amount");
  }
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let total = 1; total <= amount; total++) {
    for (const coin of coins) {
      if (coin <= total) dp[total] = Math.min(dp[total], dp[total - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
