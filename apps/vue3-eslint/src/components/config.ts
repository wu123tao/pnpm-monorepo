import {
    ElCascader,
    ElCheckbox,
    ElDatePicker,
    ElInput,
    ElInputNumber,
    ElSelectV2,
    ElSwitch,
    type FormItemProps,
    type TableColumnCtx,
} from 'element-plus';
import XRadioGroup from './components/radio-component.vue';

export enum ComponentType {
    'el-input' = 'el-input',
    'el-input-number' = 'el-input-number',
    'el-select-v2' = 'el-select-v2',
    'el-checkbox' = 'el-checkbox',
    'x-radio' = 'x-radio',
    'el-switch' = 'el-switch',
    'el-cascader' = 'el-cascader',
    'el-date-picker' = 'el-date-picker',
}

export interface EditTableColumn extends Partial<TableColumnCtx<unknown>> {
    editable?: boolean;
    editComponent?: keyof typeof ComponentType;
    componentProps?: Data | ((form: Data) => Data);
    elFormItemProps?: Partial<FormItemProps> | ((form: unknown) => Partial<FormItemProps>);
    api?: (row: unknown) => Promise<unknown>;
}

export const maps = {
    'el-input': markRaw(ElInput),
    'el-input-number': markRaw(ElInputNumber),
    'el-select-v2': markRaw(ElSelectV2),
    'el-checkbox': markRaw(ElCheckbox),
    'x-radio': markRaw(XRadioGroup),
    'el-switch': markRaw(ElSwitch),
    'el-cascader': markRaw(ElCascader),
    'el-date-picker': markRaw(ElDatePicker),
};

export type Data = Record<string, unknown>;

export interface LabelValue {
    label: string;
    value: string;
}
