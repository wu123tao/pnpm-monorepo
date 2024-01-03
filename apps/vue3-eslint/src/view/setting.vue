<template>
    <el-drawer v-model="visible" title="系统设置" destroy-on-close @open="handleOpen">
        <el-form :model="formData">
            <el-form-item :label="`${$t('setting.language')}`">
                <el-select-v2
                    v-model="formData.language"
                    :options="languageOptions"
                    placeholder="请选择"
                    @change="languageChange"
                />
            </el-form-item>
        </el-form>
    </el-drawer>
</template>
<script lang="ts" setup>
import i18n from '@/lang';

const visible = defineModel<boolean>({
    required: true,
    default: false,
});

const languageOptions = [
    { label: '简体中文', value: 'zh' },
    { label: '繁体中文', value: 'tw' },
    { label: 'English', value: 'en' },
];

const formData = ref<{ language: string }>({
    language: '',
});

function handleOpen() {
    formData.value.language = localStorage.getItem('language') || 'zh';
}

function languageChange(value: any) {
    i18n.global.locale.value = value;
    localStorage.setItem('language', value);
}
</script>
