/*
 * @lc app=leetcode.cn id=448 lang=javascript
 *
 * [448] 找到所有数组中消失的数字
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var findDisappearedNumbers = function (nums) {
    const len = nums.length;
    const newArr = Array.from(new Set(nums)).sort((a, b) => a - b);
    const arr = [];
    for (let i = 1; i <= len; i++) {
        if (!newArr.includes(i)) {
            arr.push(i);
        }
    }
    return arr;
};
// @lc code=end
