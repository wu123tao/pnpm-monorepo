import { io } from 'socket.io-client';

export const state = reactive<{ connected: boolean; fooEvents: Array<any>; barEvents: Array<any> }>(
    {
        connected: false,
        fooEvents: [],
        barEvents: [],
    }
);

const URL = 'http://localhost:3002';

export const socket = io(URL);

socket.on('connect', (...arg) => {
    console.log('开启连接', arg);
    state.connected = true;
});

socket.on('disconnect', (...arg) => {
    console.log('关闭连接了', arg);

    state.connected = false;
});
