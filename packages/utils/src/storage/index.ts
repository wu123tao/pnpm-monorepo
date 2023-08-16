/**
 * 判断字符串是否为JSON字符串
 */
function isJSON(params?: string): boolean {
    if (!params) {
        return false;
    }

    try {
        JSON.parse(params);
    } catch {
        return false;
    }

    return true;
}
/**
 * 判断local storage 是否可用
 */
function storageUseful(): boolean {
    if (window && window.localStorage) {
        return true;
    }
    throw new Error('当前环境 localstorage 不可用');
}

/**
 * 存储字段到local storage
 * @param key 存储字段
 * @param value 存储值
 */
function saveStorage(key: string, value: unknown): void {
    if (storageUseful()) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
}

/**
 * 获取local storage 存储值
 * @param key 存储字段
 */
function getStorage(key: string): any {
    if (!storageUseful()) return undefined;

    const value = window.localStorage.getItem(key);

    if (value === null) {
        return value;
    }

    if (!isJSON(value)) {
        return null;
    }
    return JSON.parse(value);
}

/**
 * 移除存储字段
 * @param key 存储字段
 */
function removeStorage(key: string): void {
    if (storageUseful()) {
        window.localStorage.removeItem(key);
    }
}

export { saveStorage, getStorage, removeStorage };
