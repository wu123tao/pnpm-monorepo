/*
 * @lc app=leetcode.cn id=905 lang=javascript
 *
 * [905] 按奇偶排序数组
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArrayByParity = function (nums) {
    const arr = new Array(nums.length);
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] % 2 === 0) {
            arr[i] = nums[i];
        } else {
            arr[nums.length - i] = nums[i];
        }
    }
    //   return arr
    console.log(arr);
};
// @lc code=end
sortArrayByParity([3, 1, 2, 4]);
