/**
 * Created by liuhuisheng on 2015/2/28.
 * todo using angular-resource to access data
 */
define(['app'], function (app) {
    app.factory('httpInterceptor', ['$q', function ($q) {
        var httpInterceptor = {
            'responseError': function (response) {
                //config.url
                if (response.status = "") {
                    // re login
                } else {
                    dhtmlx.message({
                        type: "error",
                        text: "[" + response.status + "]" + response.data.Message
                    });
                }

                return $q.reject(response);
            },
            //'response': function (response) {
            //    return response || $q.when(response);
            //},
            'request': function (config) {
                
                config.headers = config.headers || {};
                config.headers.Authorization = app.getAuthorization();
                return config || $q.when(config);
            },
            'requestError': function (config) {
                // ......
                
                return $q.reject(config);
            }
        };
        return httpInterceptor;
    }]);
});