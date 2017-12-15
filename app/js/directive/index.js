/**
 * Created by liuhuisheng on 2015/2/28.
 */
define(['app'], function (app) {
    app.directive('myHeader', function () {
        return {
            templateUrl: app.getAppRoot() + "views/main/_header.html",
            link: function (scope, element, attr) {
                app.handleToggle();
                app.handleSlimScroll();
                app.handlePulsate();
            }
        };
    });

    app.directive('myFooter', function () {
        return {
            templateUrl: app.getAppRoot() + "views/main/_footer.html",
            link: function (scope, element, attr) {
                element.addClass("dhxlayout_sep");
            }
        };
    });

    app.directive('myLayout', function () {
        return {
            link: function (scope, element, attrs) {
                scope.creator.createLayout();
            }
        };
    });

    app.directive('mySetting', function () {
        return {
            templateUrl: app.getAppRoot() + "views/main/_setting.html",
            link: function (scope, el, attr) {
                app.handleBootstrapSwitch(el);
                app.handleTemplateSetting();
            }
        };
    });

    app.directive('myChat', function () {
        return {
            templateUrl: app.getAppRoot() + "views/main/_chat.html",
            link: function (scope, el, attr) {
                app.handleBootstrapSwitch(el);
                app.handleFormChat(scope);
            }
        };
    });

    app.directive('pageContainer', function () {
        return {
            restrict: 'E',
            scope: {
                controller: '=?',
                controllerUrl: '=?',
                controllerAs:'=?',
                resolve:'=?',
                view: '='
            },
            require: ['?^^dhxLayoutCell'],
            controller: function ($scope, $rootScope, $controller, $compile) {
                $scope.load = function (html) {
                  
                    var newScope = $rootScope.$new();
                    var injectors = {
                        "$scope": newScope
                    };

                    angular.extend(injectors, $scope.resolve);

                    ctrlInstantiate = $controller($scope.controller, injectors, true, $scope.controllerAs);

                    ctrlInstantiate();
                    
                    $scope.cell.attachHTMLString($compile(html)(newScope));

                    newScope.$apply();
                }
            },
            link: function (scope, element, attrs, ctrls) {

                var layoutCtl = ctrls[0];

                var setContainer = function (layout, cell) {
                    
                    scope.cell = cell;

                    scope.$watch(["view", "resolve"], function (newval, oldval) {
                        if (newval) {
                            if (scope.controllerUrl) {
                                require(['text!../views/' + scope.view, 'controller/' + scope.controllerUrl], scope.load);
                            } else {
                                require(['text!../views/' + scope.view], scope.load);
                            }
                        }
                    })
                }

                if (layoutCtl == null || layoutCtl == undefined) {
                    setContainer();
                } else {
                    layoutCtl.addCreator(function (layout, cell) {
                        setContainer(layout, cell);
                    })
                }
            }
        }
    });
});