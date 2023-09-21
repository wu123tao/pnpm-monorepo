import type { PropType } from 'vue';
import type { DescriptionColumn } from './interface';
import { descriptionProps } from 'element-plus';

export const proDescriptionProps = {
    columns: Array<DescriptionColumn>,
    detail: Object,
    ...descriptionProps,
    align: String as PropType<'left' | 'center' | 'right'>,
    labelAlign: String as PropType<'left' | 'center' | 'right'>,
    emptyValue: String,
};
