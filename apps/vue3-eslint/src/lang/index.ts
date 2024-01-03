import zhLocale from './zh';
import enLocale from './en';
import twLocale from './tw';
import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        ...enLocale,
    },
    zh: {
        ...zhLocale,
    },
    tw: {
        ...twLocale,
    },
};

enum LanguageType {
    zh = 'zh',
    en = 'en',
    tw = 'tw',
}

const lang = computed<string>(() => {
    let language = '';
    if (navigator.language.includes('-')) {
        language = navigator.language.split('-')[0];
    } else {
        language = navigator.language;
    }

    if (localStorage.getItem('language')) {
        return localStorage.getItem('language');
    } else {
        return LanguageType[language];
    }
});

const i18n = createI18n({
    silentTranslationWarn: true, // 关闭警告信息
    globalInjection: true, // 是否开启全局
    legacy: false, // you must specify 'legacy: false' option
    locale: lang.value, //当前的语言
    messages, //语言文件
});

export default i18n;
