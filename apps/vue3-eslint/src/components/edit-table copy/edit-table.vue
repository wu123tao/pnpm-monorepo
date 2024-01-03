<template>
    <el-table :data="data" border v-bind="tableProps">
        <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>

        <template v-for="(col, i) in columns" :key="i">
            <el-table-column v-bind="col" show-overflow-tooltip align="center">
                <template v-if="col.editable" #default="{ $index, row }">
                    <edit-cell
                        :schema="col"
                        :model-value="row"
                        :row-index="$index"
                        @update:model-value="updateData($event, $index)"
                        @change="handleChange"
                    ></edit-cell>
                </template>
            </el-table-column>
        </template>

        <el-table-column label="操作" align="center" fixed="right" width="100">
            <template #default="{ row, $index }">
                <el-button type="danger" @click="deleteRow($index, row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>
<script lang="ts" setup>
import type { EditTableColumn } from './interface';
import EditCell from './edit-cell.vue';

// props
const props = withDefaults(
    defineProps<{
        modelValue: any;
        columns: EditTableColumn[];
        tableProps?: Record<string, unknown>;
    }>(),
    {
        modelValue: undefined,
        columns: undefined,
        tableProps: undefined,
    }
);

// emit
const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void;
    (e: 'delete', index: number, value: any): void;
    (e: 'change', index: number, value: any): void;
}>();

const data = computed({
    get: () => props.modelValue,
    set: (value) => {
        emits('update:modelValue', value);
    },
});

function updateData(value: Record<string, unknown>, index: number) {
    data.value[index] = value;
}

function handleChange(index: number, value: any) {
    emits('change', index, value);
}

/**
 * 删除行数据
 */
function deleteRow(index: number, row: Record<string, unknown>) {
    emits('delete', index, row);
}
</script>

<style lang="scss" scoped>
.operation {
    margin-bottom: 10px;
    float: right;
}
</style>
