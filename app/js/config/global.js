define(function (require) {
    'use strict';

    return {
        home: {
            id: 'homeTab',
            text: '我的桌面',
            icons: 'icon-home',
            ViewUrl: 'bas/home',
            ControllerUrl: 'bas/home',
            Controller:'bas/homeCtrl',
            href: '',
            close:false
        },
        dashboard: {
            limit: 30
        },
        webapi: 'http://localhost:8002/api/v1',
        signalr: 'http://localhost:14001/signalr/'
    };
});