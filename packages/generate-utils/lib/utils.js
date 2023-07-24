const axios = require('axios');
/**
 * 根据权限创建key-value[]
 */
function createEntries(list) {
    const res = [];
    for (let index = 0; index < list.length; index++) {
        const item = list[index];
        let keyValue;
        const children = item.children;

        if (children) {
            keyValue = [item.label, Object.fromEntries(createEntries(children))];
        } else {
            keyValue = [item.label, item.id];
        }

        res.push(keyValue);
    }

    return res;
}

async function getAPIJson(url) {
    try {
        const res = await axios.get(url);

        const res2 = JSON.stringify(res.data).replace(/\«|»|\s+/g, '_');

        const apiObj = JSON.parse(res2);

        for (const key in apiObj.paths) {
            const funName = key
                .split('/')
                .filter((item) => item && item !== 'api' && item !== 'v1')
                .map((item, index) => {
                    if (index === 0) {
                        return item;
                    } else {
                        return `${item[0].toUpperCase()}${item.slice(1)}`;
                    }
                })
                .join('');

            const method = Object.keys(apiObj.paths[key])[0];

            apiObj.paths[key][method].operationId = `${funName}${method.toUpperCase()}`;
        }
        return apiObj;
    } catch (error) {
        console.log('出错了');
    }
}

module.exports = { createEntries, getAPIJson };
