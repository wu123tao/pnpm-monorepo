import { ElDatePicker, ElInput, ElInputNumber, ElSelectV2 } from 'element-plus';

export enum ComponentType {
    'el-input' = 'el-input',
    'el-input-number' = 'el-input-number',
    'el-select-v2' = 'el-select-v2',
    'el-date-picker' = 'el-date-picker',
}

export const maps = {
    'el-input': markRaw(ElInput),
    'el-input-number': markRaw(ElInputNumber),
    'el-select-v2': markRaw(ElSelectV2),
    'el-date-picker': markRaw(ElDatePicker),
};
