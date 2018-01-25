define(['app', 'config'], function (app, config) {
    'use strict';
 
    var app = angular.module('chituApp', ['ngResource', 'restangular']);

    app.init = function () {
        angular.bootstrap(document, ['chituApp']);
    };
 
    app.config(function ($controllerProvider, $provide, $compileProvider,
        $resourceProvider, $httpProvider) {

        $httpProvider.interceptors.push('httpInterceptor'); //添加拦截器

     

        // Save the older references.
        app._controller = app.controller;
        app._service = app.service;
        app._factory = app.factory;
        app._value = app.value;
        app._directive = app.directive;
        app._provide = app.$provide;

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

    app.run(function ($rootScope, $http, $compile, $controller, Restangular) {
        $rootScope.currentBusiness = { Key: "System3" };

        app.getRestSrv = function (version) {
            return Restangular.withConfig(function (configSetter) {
                configSetter.setBaseUrl(config.webapi + "/" +(version ? version : "v1"));
            });
        }

        var restSrv = app.getRestSrv();

        var setBaseData = function (result) {

            var baseItem = {};
            var baseSource = {};
            $rootScope.baseEnum = {};

            angular.forEach(result, function (sys) {

                $rootScope.baseEnum[sys.Key] = {
                    "Dept": $rootScope.enum_depts_map,
                    "User": $rootScope.enum_users_map
                };
                baseItem[sys.Key] = {
                    "Dept": $rootScope.enum_depts,
                    "User": $rootScope.enum_users
                };
                baseSource[sys.Key] = [{ "Key": "Dept", "Name": " 部门" }, { "Key": "User", "Name": "用户" }];

                angular.forEach(sys.Enums, function (data) {

                    var itemHash = {};
                    if (data.Name == "Object") {
                        angular.forEach(data.Items, function (item) {
                            itemHash[item.Tags["name"]] = item.Text;
                        });
                    } else {
                        angular.forEach(data.Items, function (item) {

                            itemHash[item.Value] = item.Text;

                            item.Value = parseInt(item.Value);
                            item.Key = parseInt(item.Key);
                        });
                    }

                    $rootScope.baseEnum[sys.Key][data.Name] = itemHash;
                    baseItem[sys.Key][data.Name] = data.Items;
                    baseSource[sys.Key].push({
                        Key: data.Name,
                        Name: data.Text
                    });
                });
            });

            $rootScope.getBaseData = function (name) {
                return baseItem[$rootScope.currentBusiness.Key][name];
            }

            $rootScope.getBaseEnum = function (name) {
                return $rootScope.baseEnum[$rootScope.currentBusiness.Key][name];
            }

            $rootScope.getBaseSource = function () {
                return baseSource[$rootScope.currentBusiness.Key];
            }
        }

        restSrv.all("enum").getList().then(function (data) {
            setBaseData(data);
        });
    });

    return app;
});