<template>
    <el-card :shadow="shadow">
        <div class="table-header">
            <div class="title" style="font-size: 20px">
                {{ title }}
                <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="点击单元格进行编辑"
                    placement="top"
                >
                    <el-icon :size="20"><info-filled /></el-icon>
                </el-tooltip>
            </div>
            <div class="operation">
                <slot name="operation" :checked-rows="selectRows"></slot>
            </div>
        </div>
        <el-form ref="formRef" :model="formData">
            <el-table
                ref="tableRef"
                :row-key="rowKey"
                :data="formData.tableData"
                style="width: 100%"
                border
            >
                <el-table-column
                    v-if="selectable"
                    type="selection"
                    width="60"
                    align="center"
                    reserve-selection
                />
                <el-table-column
                    v-if="showIndex"
                    type="index"
                    align="center"
                    label="#"
                    width="70px"
                />

                <template v-for="(col, i) in columns" :key="i">
                    <el-table-column
                        v-bind="col"
                        align="center"
                        min-width="150"
                        show-overflow-tooltip
                    >
                        <template #default="{ $index, cellIndex, row }">
                            <el-form-item
                                v-if="
                                    (tableEditStatus.columnEditStatus === cellIndex &&
                                        tableEditStatus.rowEditStatus === $index) ||
                                    col.editable
                                "
                                :prop="`tableData.${$index}.${col.prop}`"
                                v-bind="col.elFormItemProps"
                            >
                                <component
                                    :is="get(maps, col.editComponent ?? 'el-input', 'el-input')"
                                    style="width: 100%"
                                    :model-value="row[col.prop ?? '']"
                                    v-bind="getComponentProps(row, col)"
                                    @update:model-value="updateData($event, $index, col.prop)"
                                ></component>
                            </el-form-item>
                            <div v-else class="cell-box" @click="openEdit($index, cellIndex, col)">
                                {{ row[col.prop ?? ''] }}
                            </div>
                        </template>
                    </el-table-column>
                </template>

                <el-table-column fixed="right" label="操作" align="center">
                    <template #default="{ $index, row }">
                        <el-button
                            v-if="tableEditStatus.rowEditStatus === $index"
                            text
                            type="primary"
                            @click="handleSave"
                        >
                            保存
                        </el-button>
                        <el-button v-else text type="danger" @click="handleDelete($index, row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </el-card>
</template>

<script lang="ts" setup>
import type { FormInstance, TableInstance, TableProps } from 'element-plus';
import { cloneDeep, get } from 'lodash-es';
import { type EditTableColumn, maps, type Data } from './config';
import { InfoFilled } from '@element-plus/icons-vue';
import { mergeProps } from 'vue';

const props = withDefaults(
    defineProps<{
        title?: string;
        selectable?: boolean;
        showIndex?: boolean;
        elTableProps?: Partial<TableProps<unknown>>;
        columns: EditTableColumn[];
        modelValue?: Data[];
        shadow?: 'hover' | 'always' | 'never';
        loading?: boolean;
        /**
         * 序号连续
         */
        continuous?: boolean;
        rowKey?: string;
        /**
         * 是否调用接口来删除
         */
        useApiDelete?: boolean;
    }>(),
    {
        title: '数据列表',
        selectable: false,
        showIndex: false,
        elTableProps: () => ({}),
        columns: () => [],
        modelValue: () => [],
        shadow: 'hover',
        loading: false,
        continuous: true,
        rowKey: 'id',
        useApiDelete: false,
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', data: Data[]): void;
    (e: 'delete', data: Data): void;
}>();

const { modelValue } = { ...props };

const formRef = ref<FormInstance>();

const tableRef = ref<TableInstance>();

const formData = ref<{ tableData: Data[] }>({
    tableData: cloneDeep(modelValue),
});

watchEffect(() => {
    formData.value.tableData = cloneDeep(modelValue);
});

const tableEditStatus = ref<{ rowEditStatus?: number; columnEditStatus?: number }>({
    rowEditStatus: undefined,
    columnEditStatus: undefined,
});

const selectRows = ref<Data[]>([]);

const extraProps = ref<Data>({
    options: [],
});

/**
 * 获取资源
 */
async function getResource(row: Data, col: EditTableColumn): Promise<boolean> {
    if (col.editComponent !== 'el-select-v2') {
        return false;
    }

    if (!col.api) {
        return false;
    }

    const res = await col.api(row);
    extraProps.value = {
        options: res,
    };

    return true;
}

function getComponentProps(row: Data, col: EditTableColumn) {
    // 默认props
    const defaultProps = {
        placeholder: col.label,
        clearable: true,
    };
    if (col.editComponent === 'el-select-v2') {
        Object.assign(defaultProps, {
            onVisibleChange: async (val: boolean): Promise<void> => {
                // 关闭不调用
                if (!val) {
                    return;
                }

                await getResource(row, col);
            },
            filterable: true,
            options: [],
        });
    }
    if (typeof col.componentProps === 'function') {
        const sec = col.componentProps(row);
        return mergeProps(defaultProps, extraProps.value, sec);
    } else {
        const a = mergeProps(defaultProps, extraProps.value, col.componentProps ?? {});

        return a;
    }
}

function updateData(value: unknown, index: number, celProp?: string) {
    formData.value.tableData[index][celProp ?? ''] = value;
    emits('update:modelValue', formData.value.tableData);
}

async function openEdit(index: number, cellIndex: number, cell: EditTableColumn) {
    console.log(cell);

    // if (!cell.editable) return;

    const validate = await formRef.value?.validate();
    if (!validate) return;

    tableEditStatus.value.columnEditStatus = cellIndex;
    tableEditStatus.value.rowEditStatus = index;
}

function handleDelete(index: number, row: Data) {
    if (props.useApiDelete) {
        emits('delete', row);
    } else {
        formData.value.tableData.splice(index, 1);
        emits('update:modelValue', formData.value.tableData);
    }
}

async function handleSave() {
    const validate = await formRef.value?.validate();
    if (!validate) return;

    tableEditStatus.value.columnEditStatus = undefined;
    tableEditStatus.value.rowEditStatus = undefined;
}

async function validate(): Promise<boolean> {
    const valid = await formRef.value?.validate();

    if (!valid) {
        return false;
    }

    return true;
}

watchEffect(() => {
    selectRows.value = tableRef.value?.getSelectionRows();
});

defineExpose({ validate });
</script>

<style lang="scss" scoped>
.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
}
.cell-box {
    min-height: 23px;
}
.cell-box:hover {
    border: 1px transparent dotted;
    border-color: var(--el-color-primary);
    cursor: pointer;
}
</style>
