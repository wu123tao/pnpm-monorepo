/**
 * 环境变量配置
 */
export interface Env {
    ENV_NAME: string;
    VITE_API_URL: string;
    [key: string]: string;
}
