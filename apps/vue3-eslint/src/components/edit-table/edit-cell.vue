<template>
    <el-form-item :prop="`tableData.${rowIndex}.${schema?.prop}`" v-bind="itemProps">
        <component
            :is="get(maps, schema?.editComponent ?? 'el-input', 'el-input')"
            style="width: 100%"
            :model-value="currentValue"
            v-bind="componentProps"
            @update:model-value="updateData"
        ></component>
    </el-form-item>
</template>
<script lang="ts" setup>
import { mergeProps } from 'vue';
import type { EditTableColumn, LabelValue } from './interface';
import { get, isNumber, isString, set } from 'lodash-es';
import { maps } from './config';

const props = withDefaults(
    defineProps<{
        schema?: EditTableColumn;
        modelValue: any;
        rowIndex?: number;
        cellIndex?: number;
    }>(),
    {
        modelValue: undefined,
        schema: undefined,
        rowIndex: undefined,
        cellIndex: undefined,
    }
);

// emits
const emits = defineEmits<{
    (e: 'update:modelValue', value?: any): void;
    (e: 'change', index: number, value?: any): void;
}>();

const formData = computed<any>({
    get: () => props.modelValue,
    set: (value) => {
        console.log(value, 'computed');

        emits('update:modelValue', value);
    },
});

const currentValue = ref<any>();

// 初始化值
currentValue.value = get(formData.value, props.schema?.prop ?? '', undefined);

function updateData(value?: any): void {
    if (isString(currentValue.value)) {
        currentValue.value = value;
    } else if (isNumber(currentValue.value)) {
        if (value === undefined || value === null) {
            currentValue.value = undefined;
        }
    }

    currentValue.value = value;

    // 异常校验
    if (!formData.value) {
        formData.value = {};
    }

    if (props.schema?.editComponent === 'el-select-v2' && componentProps.value.labelSchema) {
        getLabelSchemaValue(value);
    }

    set(formData.value, props.schema?.prop ?? '', value);

    emits('update:modelValue', formData.value);
}

// 监听外部数据变化
watchEffect(() => {
    currentValue.value = get(formData.value, props.schema?.prop ?? '', undefined);
});

/**
 * extra props
 * 用于解决computed属性不触发更新的问题
 */
const extraProps = ref<any>({
    options: [],
});

/**
 * 获取资源
 */
async function getResource(): Promise<boolean> {
    if (props.schema?.editComponent !== 'el-select-v2') {
        return false;
    }

    if (!props.schema.api) {
        return false;
    }

    const res = await props.schema.api(props.modelValue);

    extraProps.value = {
        options: res,
    };

    if (!props.modelValue) {
        return true;
    }

    // label选id
    const label = props.modelValue[props.schema.componentProps?.labelSchema];

    // 无label
    if (!label) {
        return true;
    }

    const item = componentProps.value.options.find((item: LabelValue) => item.label === label);

    // label存在于列表中
    if (item) {
        updateData(item.value);
    }

    return true;
}

/**
 * component props
 */
const componentProps = computed<any>(() => {
    const { schema } = props;

    // 默认props
    const defaultProps = {
        placeholder: schema?.label,
        clearable: true,
    };

    // select || cascader
    if (schema?.editComponent === 'el-select-v2') {
        Object.assign(defaultProps, {
            /**
             * el-select-v2 visible-change
             */
            onVisibleChange: async (val: boolean): Promise<void> => {
                // 关闭不调用
                if (!val) {
                    return;
                }

                await getResource();
            },
            filterable: true,
            options: [],
        });
    }

    // merge props
    if (typeof schema?.componentProps === 'function') {
        const sec = schema.componentProps(props.modelValue);
        return mergeProps(defaultProps, extraProps.value, sec, schema as any);
    } else {
        return mergeProps(
            defaultProps,
            extraProps.value,
            schema?.componentProps as any,
            schema as any
        );
    }
});

/**
 * form item props
 */
const itemProps = computed(() => {
    return typeof props.schema?.elFormItemProps === 'function'
        ? props.schema.elFormItemProps(props.modelValue)
        : props.schema?.elFormItemProps;
});

/**
 * 获取下拉的label
 */
function getLabelSchemaValue(value?: any) {
    if (componentProps.value.multiple) {
        const selectedLabels = (value as string[])
            .map((id) => componentProps.value.options.find((item: LabelValue) => item.value === id))
            .map((item: LabelValue) => item.label);

        if (!formData.value) {
            formData.value = {};
        }

        emits(
            'update:modelValue',
            set(formData.value, componentProps.value.labelSchema, selectedLabels.toString())
        );
    } else {
        const selected = componentProps.value.options.find(
            (item: LabelValue) => item.value === value
        );

        if (!formData.value) {
            formData.value = {};
        }

        emits(
            'update:modelValue',
            set(formData.value, componentProps.value.labelSchema, selected?.label || '')
        );
    }
}

onMounted(async () => {
    await getResource();
});
</script>
