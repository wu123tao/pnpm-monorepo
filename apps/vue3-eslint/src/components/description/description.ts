import { ElDescriptions, ElDescriptionsItem } from 'element-plus';
import { proDescriptionProps } from './props';
import { mergeProps, h } from 'vue';
import { get } from 'lodash-es';
import type { DescriptionColumn } from './interface';

export default defineComponent({
    name: 'ProDescription',
    props: proDescriptionProps,
    setup(props, { slots }) {
        function renderText(item: DescriptionColumn) {
            if (item.render) {
                return item.render(props.detail);
            } else {
                return get(props.detail, item.prop) ?? props.emptyValue;
            }
        }

        function createChildren() {
            return props.columns?.map((item) => {
                return h(
                    ElDescriptionsItem,
                    {
                        ...item,
                        align: item.align ?? props.align,
                        labelAlign: item.labelAlign ?? props.labelAlign,
                    },
                    {
                        default: () => renderText(item),
                    }
                );
            });
        }
        return () => {
            console.log(createChildren());

            const children: Record<string, unknown> = {
                default: () => createChildren(),
            };
            if (slots['title']) {
                children.title = () => slots['title']?.();
            }
            if (slots['extra']) {
                children.extra = () => slots['extra']?.();
            }

            return h(ElDescriptions, mergeProps(props), children);
        };
    },
});
