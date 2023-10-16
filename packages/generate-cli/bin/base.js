import { generateApi } from './generate-api/index.js';
import { generatePermission } from './generate-permission/index.js';
/**
 * 生成的类型
 */
export var GENERATE_TYPE;
(function (GENERATE_TYPE) {
    GENERATE_TYPE[(GENERATE_TYPE['\u6743\u9650'] = 1)] = '\u6743\u9650';
    GENERATE_TYPE[(GENERATE_TYPE['\u63A5\u53E3'] = 2)] = '\u63A5\u53E3';
})(GENERATE_TYPE || (GENERATE_TYPE = {}));
export const generateType = {
    [GENERATE_TYPE.权限]: generatePermission,
    [GENERATE_TYPE.接口]: generateApi,
};
