import {
    ElCascader,
    ElCheckbox,
    ElDatePicker,
    ElInput,
    ElInputNumber,
    ElRadio,
    ElSelectV2,
    ElSwitch,
    type FormItemProps,
    type TableColumnCtx,
} from 'element-plus';

export enum ComponentType {
    'input' = 'el-input',
    'input-number' = 'el-input-number',
    'select-v2' = 'el-select-v2',
    'checkbox' = 'el-checkbox',
    'radio' = 'el-radio',
    'switch' = 'el-switch',
    'cascader' = 'el-cascader',
    'date-picker' = 'el-date-picker',
}

export interface EditTableColumn extends Partial<TableColumnCtx<unknown>> {
    editable?: boolean;
    editComponent?: string;
    componentProps?: Data | ((form: Data) => Data);
    elFormItemProps?: Partial<FormItemProps> | ((form: unknown) => Partial<FormItemProps>);
    api?: (row: unknown) => Promise<unknown>;
}

export const maps = {
    'el-input': markRaw(ElInput),
    'el-input-number': markRaw(ElInputNumber),
    'el-select-v2': markRaw(ElSelectV2),
    'el-checkbox': markRaw(ElCheckbox),
    'el-radio': markRaw(ElRadio),
    'el-switch': markRaw(ElSwitch),
    'el-cascader': markRaw(ElCascader),
    'el-date-picker': markRaw(ElDatePicker),
};

export type Data = Record<string, unknown>;
