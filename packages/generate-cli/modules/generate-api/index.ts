import { createJson, generateOpenApi } from './operate.js';

export async function generateApi(params: any) {
    createJson(params);
    generateOpenApi();
}
