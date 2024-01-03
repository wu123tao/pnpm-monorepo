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
                @cell-click="handleCellClick"
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
                        :class-name="col.editable ? 'edit_cell' : ''"
                    >
                        <template #header>
                            <div class="cell_header">
                                <span>{{ col.label }}</span>
                                <el-icon v-if="col.editable" class="edit_icon">
                                    <edit></edit>
                                </el-icon>
                            </div>
                        </template>

                        <template
                            v-if="tableEditStatus.columnEditStatus"
                            #default="{ $index, cellIndex, row }"
                        >
                            <edit-cell
                                v-if="
                                    tableEditStatus.columnEditStatus === cellIndex &&
                                    tableEditStatus.rowEditStatus === $index
                                "
                                :schema="col"
                                :model-value="row"
                                :cell-index="cellIndex"
                                :row-index="$index"
                                @update:model-value="updateData($event, $index)"
                            ></edit-cell>
                        </template>
                    </el-table-column>
                </template>

                <el-table-column fixed="right" label="操作" align="center">
                    <template #default="{ $index, row }">
                        <template v-if="tableEditStatus.rowEditStatus === $index">
                            <el-button text type="primary" @click="handleSave(row)">
                                保存
                            </el-button>
                            <el-button text type="primary" @click="handleCancel($index)">
                                取消
                            </el-button>
                        </template>
                        <el-button v-else text type="danger" @click="handleDelete($index, row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
    </el-card>
</template>

<script lang="ts" setup generic="T">
import { type FormInstance, type TableInstance, type TableProps } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { type EditTableColumn, type Data } from './interface';
import { InfoFilled, Edit } from '@element-plus/icons-vue';
import EditCell from './edit-cell.vue';

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
        rowKey?: string;
    }>(),
    {
        title: '数据列表',
        selectable: true,
        showIndex: true,
        elTableProps: () => ({}),
        columns: () => [],
        modelValue: () => [],
        shadow: 'hover',
        loading: false,
        rowKey: 'id',
    }
);

const emits = defineEmits<{
    'update:modelValue': [data: Data[]];
    delete: [index: number, data: Data];
    save: [data: Data];
}>();

const { modelValue } = toRefs(props);

const formRef = ref<FormInstance>();

const tableRef = ref<TableInstance>();

const formData = ref<{ tableData: Data[] }>({
    tableData: cloneDeep(modelValue.value),
});

const selectRows = ref<Data[]>([]);

watchEffect(() => {
    formData.value.tableData = cloneDeep(modelValue.value);
});

const tableEditStatus = ref<{ rowEditStatus?: number; columnEditStatus?: number }>({
    rowEditStatus: undefined,
    columnEditStatus: undefined,
});

/**
 * 行数据的原始数据
 */
const rawData = ref<Record<string, unknown>>({});

function updateData(value: any, index: number) {
    formData.value.tableData[index] = value;
    emits('update:modelValue', formData.value.tableData);
}

async function handleCellClick(row: Record<string, unknown>, col: Record<string, any>) {
    const validate = await formRef.value?.validate();
    if (!validate) return;

    const rowIndex = formData.value.tableData.findIndex(
        (item) => item[props.rowKey] === row[props.rowKey]
    );
    rawData.value = { ...row };
    const isEditCell = props.columns.find((item) => item.prop === col.property)?.editable;

    if (!isEditCell) {
        tableEditStatus.value.rowEditStatus = undefined;
        tableEditStatus.value.columnEditStatus = undefined;
        return;
    }

    tableEditStatus.value.rowEditStatus = rowIndex;
    tableEditStatus.value.columnEditStatus = col.no;
}

function handleCancel(index: number) {
    formData.value.tableData[index] = { ...rawData.value };

    tableEditStatus.value.columnEditStatus = undefined;
    tableEditStatus.value.rowEditStatus = undefined;
}

function handleDelete(index: number, row: Data) {
    emits('delete', index, row);
}

async function handleSave(row: Record<string, unknown>) {
    const validate = await formRef.value?.validate();
    if (!validate) return;

    tableEditStatus.value.columnEditStatus = undefined;
    tableEditStatus.value.rowEditStatus = undefined;
    emits('save', row);
}

async function validate(): Promise<boolean> {
    const valid = await formRef.value?.validate();

    if (!valid) {
        return false;
    }

    return true;
}

function clearSelection() {
    tableRef.value?.clearSelection();
}

watchEffect(() => {
    selectRows.value = tableRef.value?.getSelectionRows();
});

defineExpose({ validate, clearSelection });
</script>

<style lang="scss" scoped>
.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
}
:deep(td.edit_cell > .cell) {
    min-height: 25px;
}
:deep(td.edit_cell > .cell):hover {
    border: 1px transparent dotted;
    border-color: var(--el-color-primary);
    cursor: pointer;
}
.cell_header {
    display: flex;
    justify-content: center;
    align-items: center;
}
.edit_icon {
    margin-left: 10px;
}
</style>
