import type { VNode } from 'vue';

export interface DescriptionColumn<T = any> {
    prop: keyof T;
    label?: string;
    width?: string | number;
    minWidth?: string | number;
    align?: 'left' | 'center' | 'right';
    labelAlign?: 'left' | 'center' | 'right';
    className?: string;
    labelClassName?: string;
    render?: (detail: T) => string | VNode;
}
