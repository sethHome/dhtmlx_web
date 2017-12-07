﻿/**
 * Created by liuhuisheng on 2015/2/28.
 * todo using angular-resource to access data
 */
define(['app'], function (app) {
    app.factory('httpInterceptor', ['$q', function ($q) {
        var httpInterceptor = {
            'responseError': function (response) {
                // ......
                return $q.reject(response);
            },
            //'response': function (response) {
            //    return response || $q.when(response);
            //},
            'request': function (config) {
                config.headers = config.headers || {};
                //if ($localStorage.token) {
                //    config.headers.token = $localStorage.token;
                //    // config.headers['X-Access-Token'] = $localStorage.token;
                //};
                config.headers.Authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJyb2xlIjoidXNlcnMiLCJpc3MiOiJHb2xkU29mdCIsImF1ZCI6Imh0dHA6Ly93d3cuamlucXUuY24iLCJleHAiOjE1MTMyMTUxOTYsIm5iZiI6MTUxMjYxMDM5Nn0.R-3xXUXL1LIkCPKuje0fgdi3ogFgpaN_7phbADW4byk';
                return config || $q.when(config);

                return config;
            },
            'requestError': function (config) {
                // ......
                return $q.reject(config);
            }
        };
        return httpInterceptor;
    }]);
});