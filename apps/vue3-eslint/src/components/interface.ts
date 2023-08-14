import { type FormItemProps, type TableColumnCtx } from 'element-plus';
import { ComponentType } from './config';

export interface EditTableColumn extends Partial<TableColumnCtx<unknown>> {
    editable?: boolean;
    editComponent?: keyof typeof ComponentType;
    componentProps?: Data | ((form: Data) => Data);
    elFormItemProps?: Partial<FormItemProps> | ((form: unknown) => Partial<FormItemProps>);
    api?: (row: unknown) => Promise<unknown>;
}

export type Data = Record<string, unknown>;

export interface LabelValue {
    label: string;
    value: string;
}
