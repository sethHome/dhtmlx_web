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
                page:'=?',
                controller: '=?',
                controllerUrl: '=?',
                controllerAs:'=?',
                resolve: '=?',
                set:'&?',
                view: '=?'
            },
            require: ['?^^dhxLayoutCell'],
            controller: function ($scope, $rootScope, $controller, $compile) {
                $scope.load = function (html) {
                  
                    var newScope = $rootScope.$new();
                    var injectors = {
                        "$scope": newScope
                    };

                    angular.extend(injectors, $scope.page.resolve);

                    ctrlInstantiate = $controller($scope.page.controller, injectors, true, $scope.page.controllerAs);

                    ctrlInstantiate();
                    $scope.cell.detachObject();

                    $scope.cell.attachHTMLString($compile(html)(newScope));
                    
                    newScope.$apply();
                }
            },
            link: function (scope, element, attrs, ctrls) {

               

                var layoutCtl = ctrls[0];

                var setContainer = function (layout, cell) {
                    
                    scope.cell = cell;

                    var init = function () {
                        
                        if (scope.page.controllerUrl) {
                            require(['text!../views/' + scope.page.view, 'controller/' + scope.page.controllerUrl], scope.load);
                        } else {
                            require(['text!../views/' + scope.page.view], scope.load);
                        }
                    }

                    scope.$watch("page", function (newval, oldval) {
                        if (newval && newval.view) {
                            init();
                        }
                    }, true);

                    
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