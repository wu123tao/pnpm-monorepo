<template>
    <div>
        <el-radio-group :model-value="modelValue" @update:model-value="updateData">
            <el-radio v-for="(item, i) in options" :key="i" :label="item.value">{{
                item.label
            }}</el-radio>
        </el-radio-group>
    </div>
</template>
<script lang="ts" setup>
import type { LabelValue } from '../config';

withDefaults(
    defineProps<{
        modelValue?: string | number | undefined | boolean;
        options?: LabelValue[];
    }>(),
    {
        modelValue: undefined,
        options: () => [],
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', data: string | number | undefined | boolean): void;
}>();

function updateData(value: string | number | undefined | boolean) {
    emits('update:modelValue', value);
}
</script>
