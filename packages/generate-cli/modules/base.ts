import { generateApi } from './generate-api/index.js';
import { generatePermission } from './generate-permission/index.js';

/**
 * 生成的类型
 */
export enum GENERATE_TYPE {
    权限 = 1,
    接口 = 2,
}

/**
 * 根据不同的生成类型调用对应的方法
 */
export const generateType = {
    [GENERATE_TYPE.权限]: generatePermission,
    [GENERATE_TYPE.接口]: generateApi,
};
