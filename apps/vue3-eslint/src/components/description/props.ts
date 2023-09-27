import { type PropType } from 'vue';
import type { DescriptionColumn } from './interface';
import { type CardProps, descriptionProps } from 'element-plus';

export const proDescriptionProps = {
    ...descriptionProps,
    columns: Array<DescriptionColumn>,
    detail: Object,
    align: String as PropType<'left' | 'center' | 'right'>,
    labelAlign: String as PropType<'left' | 'center' | 'right'>,
    emptyValue: String,
    showCard: {
        type: Boolean,
        default: true,
    },
    cardProps: Object as PropType<Partial<CardProps>>,
};
