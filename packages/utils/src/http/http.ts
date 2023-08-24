import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { getStorage } from '../storage/index';
import { HTTP_ERROR_NOTICE, HttpStatus } from './constant';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';

/**
 * 拦截器配置函数参数
 */
interface Options {
    /**
     * 后端url
     */
    url?: string;
    /**
     * 超时时间(ms)
     */
    timeout?: number;
    /**
     * 保存在local storage 里的token key值
     */
    storageTokenKey?: string;
    /**
     * 请求头携带token key值
     */
    requestHeaderTokenKey?: string;

    /**
     * 提示信息
     */
    notification?: (responseData: string) => any;
}

interface AxiosResponseData extends AxiosResponse {
    data: ResponseData;
}

/**
 * 后端返回数据格式
 */
interface ResponseData {
    code: number;
    message: string | null;
    data: any;
}

/**
 * 后端返回数据格式
 */
interface HttpResponse<T> {
    message: string | null;
    data: T;
    code: number;
}

/**
 * 拦截器配置函数
 * @param {Options} options 配置项
 * @returns 接口函数
 */
function setupAxiosInterceptors(options: Options) {
    if (!options.url) {
        throw new Error(`未设置 'url'`);
    }
    /**
     * axios实例
     */
    const service = axios.create({
        baseURL: options.url || '',
        timeout: options.timeout || 60000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // 请求拦截
    service.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            nProgress.start();

            // 统一添加token
            const token = getStorage(options.storageTokenKey || 'v-token') as string;
            if (token && config.headers) {
                config.headers[options.requestHeaderTokenKey || 'v-token'] = token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // 响应拦截
    service.interceptors.response.use(
        (response: AxiosResponseData): any => {
            nProgress.done();

            const responseData = response.data;

            // 成功响应状态
            if (responseData.code === HttpStatus.OK) {
                return Promise.resolve({ message: responseData.message, data: responseData.data });
            }
            options.notification(responseData.message);

            return Promise.resolve(null);
        },
        (error: AxiosError) => {
            nProgress.done();

            const statusCode = error.response?.status;
            if (statusCode) {
                options.notification(HttpStatus[statusCode]);
                return Promise.resolve(null);
            }
            if (error.message.indexOf('timeout') >= 0) {
                options.notification(HTTP_ERROR_NOTICE.TIME_OUT);
            } else if (error.message.indexOf('Network Error') >= 0) {
                options.notification(HTTP_ERROR_NOTICE.NETWORK_ERROR);
            } else {
                options.notification(HTTP_ERROR_NOTICE.UNKNOWN);
            }
            return null;
        }
    );

    /**
     * POST
     */
    const post = service.post;

    /**
     * GET
     */
    const get = service.get;

    /**
     * PUT
     */
    const put = service.put;

    /**
     * DELETE
     */
    const del = service.delete;

    return { post, get, put, del };
}

export { setupAxiosInterceptors, type HttpResponse };
