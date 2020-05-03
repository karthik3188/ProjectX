import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface AppConfig {
    availableLanguages: Array<{ code: string, name: string }>;
    showBuyPromt: boolean;
}

export const BaseAppConfig: AppConfig = {
    availableLanguages: [{
        code: 'en',
        name: 'English'
    }, {
        code: 'hi',
        name: 'Hindi'
    }, {
        code: 'ka',
        name: 'Kannada'
    }, {
        code: 'ta',
        name: 'Tamil'
    }, {
        code: 'te',
        name: 'Telugu'
    }, {
        code: 'ma',
        name: 'Malayalam'
    }],
    showBuyPromt: false
};