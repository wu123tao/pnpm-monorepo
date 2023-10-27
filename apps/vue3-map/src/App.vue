<template>
    <div id="container"></div>
    <el-affix class="place" position="bottom" :offset="900">
        <el-autocomplete
            id="tipInput"
            v-model="place"
            style="width: 30%"
            :fetch-suggestions="querySearchAsync"
            @select="placeSelect"
        >
            <template #prepend>请输入关键词</template>
        </el-autocomplete>
    </el-affix>
    <el-affix position="bottom" :offset="50">
        <el-switch
            v-model="showTraffic"
            size="large"
            inline-prompt
            style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"
            active-text="隐藏路况"
            inactive-text="显示路况"
            @change="trafficStatusChanged"
        />

        <el-switch
            v-model="showSatellite"
            size="large"
            inline-prompt
            style="--el-switch-on-color: #ff4949; --el-switch-off-color: #13ce66"
            active-text="隐藏卫星地图"
            inactive-text="显示卫星地图"
            @change="satelliteStatusChanged"
        />
    </el-affix>
</template>

<script setup lang="ts">
import { createMap } from './map';

/**
 * 输入信息
 */
const place = ref<string>('');

const placeList = ref<any[]>([]);

/**
 * 是否显示路况图层
 */
const showTraffic = ref<boolean>(false);

/**
 * 是否显示卫星图层
 */
const showSatellite = ref<boolean>(false);

/**
 * 地图实例
 */
const map = ref<any>();

/**
 * 实时路况图层
 */
const trafficLayer = ref<any>();

/**
 * 定位信息
 */
const currentPosition = ref<any>();

/**
 * 当前定位城市信息
 */
const cityInfo = ref<any>();
/**
 * 卫星地图图层
 */
const satelliteLayer = ref<any>();

const autoComplete = ref<any>();
const placeSearch = ref<any>();

onMounted(() => {
    initMap();
});

/**
 * 初始化地图
 */
async function initMap() {
    const AMap: any = await createMap();

    if (!AMap) {
        return;
    }

    map.value = new AMap.Map('container', {
        viewMode: '3D',
        zoom: 18,
        resizeEnable: true,
    });

    // 添加插件
    AMap.plugin(
        [
            'AMap.ToolBar',
            'AMap.HawkEye',
            'AMap.Scale',
            'AMap.Geolocation',
            'AMap.AutoComplete',
            'AMap.PlaceSearch',
        ],
        () => {
            // 工具条插件
            const toolbar = new AMap.ToolBar({
                visible: true,
                position: {
                    top: '50%',
                    right: '40px',
                },
            });
            // 鹰眼插件
            const overView = new AMap.HawkEye({ visible: true });
            // 比例尺插件
            const scale = new AMap.Scale({ visible: true });
            // 定位
            const geolocation = new AMap.Geolocation({
                GeoLocationFirst: true,
                // 设置定位超时时间，默认：无穷大
                // timeout: 10000,
                // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                zoomToAccuracy: true,
                // 定位按钮的排放位置,  RB表示右下
                buttonPosition: 'RB',
                extensions: 'all',
            });
            // 搜索
            // 使用搜索功能需要配置安全密钥使用
            autoComplete.value = new AMap.AutoComplete({ city: '全国' });
            placeSearch.value = new AMap.PlaceSearch({ map: map.value });

            // 实时路况图层
            trafficLayer.value = new AMap.TileLayer.Traffic({ zIndex: 11 });
            // 卫星图层
            satelliteLayer.value = new AMap.TileLayer.Satellite();
            // 添加图层
            new AMap.LayerGroup([trafficLayer.value, satelliteLayer.value]);

            map.value.addControl(toolbar);
            map.value.addControl(overView);
            map.value.addControl(scale);
            map.value.addControl(geolocation);

            // 获取用户当前的精确位置信息
            geolocation.getCurrentPosition((status: any, result: any) => {
                if (status === 'complete') {
                    currentPosition.value = result;
                }
            });
            // 进行IP城市查询
            geolocation.getCityInfo((status: any, result: any) => {
                if (status === 'complete') {
                    cityInfo.value = result;
                }
            });
        }
    );
}

/**
 * 路况切换
 */
function trafficStatusChanged(value: string | number | boolean) {
    nextTick(() => {
        if (value) {
            map.value.addLayer(trafficLayer.value);
        } else {
            map.value.removeLayer(trafficLayer.value);
        }
    });
}

/**
 * 卫星图切换
 */
function satelliteStatusChanged(value: string | number | boolean) {
    if (value) {
        map.value.addLayer(satelliteLayer.value);
    } else {
        map.value.removeLayer(satelliteLayer.value);
    }
}

/**
 * 查询
 */
function querySearchAsync(queryString: string, cb: (arg: any) => void) {
    autoComplete.value.search(queryString, (status: any, result: any) => {
        placeList.value = [];
        if (result.tips && result.tips.length) {
            placeList.value = result.tips.map((item: any) => ({
                ...item,
                value: item.name,
                link: item.location,
            }));
        }
        cb(placeList.value);
    });
}

/**
 * 城市选择
 */
function placeSelect(item: Record<string, any>) {
    placeSearch.value.setCity(item.adcode);
    placeSearch.value.search(item.name);
}

onUnmounted(() => {
    map.value?.destroyed();
});
</script>

<style lang="scss" scoped>
#container {
    height: 100%;
}
</style>
