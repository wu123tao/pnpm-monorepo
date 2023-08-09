/*
 * @lc app=leetcode.cn id=258 lang=javascript
 *
 * [258] 各位相加
 */

// @lc code=start
/**
 * @param {number} num
 * @return {number}
 */
var addDigits = function (num) {
    const numstr = num.toString();
    const length = numstr.length;
    let newNum = 0;
    for (let i = 0; i < length; i++) {
        newNum = newNum + Number(numstr[i]);
    }

    if (newNum.toString().length === 1) {
        return Number(newNum);
    } else {
        addDigits(newNum);
    }
};
// @lc code=end

console.log(addDigits(38));
