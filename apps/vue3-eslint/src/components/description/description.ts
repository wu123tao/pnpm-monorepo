import { ElCard, ElDescriptions, ElDescriptionsItem } from 'element-plus';
import { proDescriptionProps } from './props';
import { h } from 'vue';
import { get, omit } from 'lodash-es';
import type { DescriptionColumn } from './interface';

export default defineComponent({
    name: 'ProDescription',
    props: proDescriptionProps,
    setup(props, { slots }) {
        const { cardProps } = props;
        const descProps = omit(props, 'cardProps');

        /**
         * 渲染每个item的内容
         */
        function renderDescText(item: DescriptionColumn) {
            if (item.render) {
                return item.render(descProps.detail);
            } else {
                return get(descProps.detail, item.prop) ?? descProps.emptyValue;
            }
        }

        /**
         * 渲染 DescriptionsItem
         */
        function renderDescChildren() {
            return descProps.columns?.map((item) => {
                return h(
                    ElDescriptionsItem,
                    {
                        ...item,
                        align: item.align ?? descProps.align,
                        labelAlign: item.labelAlign ?? descProps.labelAlign,
                    },
                    {
                        default: () => renderDescText(item),
                    }
                );
            });
        }

        /**
         * 渲染 Descriptions
         */
        function renderDescription() {
            const descChildren: Record<string, unknown> = {
                default: () => renderDescChildren(),
            };
            if (slots['title']) {
                descChildren.title = () => slots['title']?.();
            }
            if (slots['extra']) {
                descChildren.extra = () => slots['extra']?.();
            }

            return h(ElDescriptions, { ...descProps }, descChildren);
        }

        return () => {
            if (props.showCard) {
                return h(ElCard, { ...cardProps }, { default: () => renderDescription() });
            } else {
                return renderDescription();
            }
        };
    },
});
