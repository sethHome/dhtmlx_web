﻿define(['app', 'config'], function (app, config) {
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

        $rootScope.openWindow = function (option) {
          
            $http.get(option.url).success(function (html) {

                var newScope = $rootScope.$new();
                newScope.$params = option.params;

                var id = "win_" + app.genStr(6);

                if (angular.isFunction(option.controller)) {
                    var fn = $compile(html);
                    $(document.body).append(fn(newScope, option.controller));
                }else if (option.controller) {
                    var html = $(html).attr("id", id).attr("ng-controller", option.controller);
                    $(document.body).append($compile(html)(newScope));
                }
            });
        }
    });

    return app;
});