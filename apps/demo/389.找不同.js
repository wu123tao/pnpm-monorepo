/*
 * @lc app=leetcode.cn id=389 lang=javascript
 *
 * [389] 找不同
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {character}
 */
var findTheDifference = function (s, t) {
    const arr = Array.from(t);
    for (const char of s) {
        if (arr.includes(char)) {
            arr.splice(arr.indexOf(char), 1);
        }
    }
    return arr[0];
};
// @lc code=end
