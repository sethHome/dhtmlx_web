define(['app', 'config'], function (app, config) {
    'use strict';
 
    var app = angular.module('chituApp', ['ngResource', "restangular"]);

    app.init = function () {
        angular.bootstrap(document, ['chituApp']);
    };
 
    app.config(function ($controllerProvider, $provide, $compileProvider,
        $resourceProvider,RestangularProvider, $httpProvider) {

        $httpProvider.interceptors.push('httpInterceptor'); //添加拦截器

        RestangularProvider.setBaseUrl(config.webapi);
        RestangularProvider.setResponseExtractor(function (response, operation) {
            return response.data;
        });

        // Save the older references.
        app._controller = app.controller;
        app._service = app.service;
        app._factory = app.factory;
        app._value = app.value;
        app._directive = app.directive;

        // Provider-based controller.
        app.controller = function (name, constructor) {
            $controllerProvider.register(name, constructor);
            return (this);

        };

        // Provider-based service.
        app.service = function (name, constructor) {
            $provide.service(name, constructor);
            return (this);

        };

        // Provider-based factory.
        app.factory = function (name, factory) {
            $provide.factory(name, factory);
            return (this);

        };

        // Provider-based value.
        app.value = function (name, value) {
            $provide.value(name, value);
            return (this);

        };

        // Provider-based directive.
        app.directive = function (name, factory) {
            $compileProvider.directive(name, factory);
            return (this);

        };
 
        // $resource settings
        $resourceProvider.defaults.stripTrailingSlashes = false;
    });

    app.run(function ($rootScope, $http, $compile) {
      
        $rootScope.openWin = function (option) {

            var option = $.extend({
                position: {
                    x: 0,
                    y: 0
                },
                size: {
                    width: 500,
                    height: 400
                },
                modal:true,
                text: {
                    head: '新建窗口',
                    status: '新建窗口'
                }
            }, option);

            var dhxWins = new dhtmlXWindows();
            var w1 = dhxWins.createWindow(app.genStr(6), option.position.x, option.position.y, option.size.width, option.size.height);
            w1.setText(option.text.head);
            w1.attachStatusBar({ text: option.text.status });

            $http.get(option.url).success(function (html) {
                var id = app.genStr(6);
                var html = $(html).attr("id", id).attr("ng-controller", option.controller);
                var newScope = $rootScope.$new();
                newScope.$win = w1;
                w1.attachHTMLString($compile(html)(newScope));
            });

            w1.button("close").attachEvent("onClick", function () {
                if (option.modal) {
                    w1.setModal(false);
                }
                
                w1.hide();
                return false;
            });
            w1.setModal(option.modal);
            w1.center();

            return w1;
        }

    });

    return app;
});