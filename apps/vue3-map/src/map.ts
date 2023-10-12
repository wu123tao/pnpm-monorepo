import AMapLoader from '@amap/amap-jsapi-loader';

export function createMap() {
    return new Promise((resolve) => {
        resolve(
            AMapLoader.load({
                key: '4dad239a1b8b454b48ed0f2547df500b',
                version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
            })
        );
    });
}
