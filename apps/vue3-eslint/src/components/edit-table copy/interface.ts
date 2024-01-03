import { type FormItemProps, type TableColumnCtx } from 'element-plus';
import { ComponentType } from './conf';

export interface EditTableColumn extends Partial<TableColumnCtx<unknown>> {
    editable?: boolean;
    editComponent?: keyof typeof ComponentType;
    componentProps?: any | ((form: Data) => any);
    elFormItemProps?: Partial<FormItemProps> | ((form: unknown) => Partial<FormItemProps>);
    api?: (row: unknown) => Promise<any>;
}

export type Data = Record<string, unknown>;

export interface LabelValue {
    label: string;
    value: string;
}

export interface EditTableRef {
    validate: () => Promise<boolean>;
    clearSelection: () => void;
}
