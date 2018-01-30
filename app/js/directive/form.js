/**
 * Created by liuhuisheng on 2015/2/28.
 */
define(['app'], function (app) {
    app.directive('myCheckbox', function () {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                iconspath: '@'
            },
            link: function (scope, element, attrs) {
                element.attr("id", "dhx_toolbar_" + scope.uid);
                element.css({ "border-width": "0 0 1px 0" });
                scope.toolbar = new dhtmlXToolbarObject(element.attr("id"));
                scope.toolbar.setIconsPath(app.getProjectRoot(scope.iconspath));

                scope.toolbar.addButton("new", 1, "新增", "add.png");
                scope.toolbar.addButton("edit", 2, "修改", "edit.gif");
                scope.toolbar.addButton("del", 3, "删除", "cross.png");
                scope.toolbar.addButton("test2", 5, "测试", "fa fa-comments", "green");
                scope.toolbar.disableItem("edit");
                scope.toolbar.attachEvent("onClick", function (id) {
                    alert(id);
                });
            }
        }
    });

    app.directive('fmCheckbox', function () {
        return {
            restrict: 'E',
            template: '<div class="selectbox" ng-repeat="item in items track by $index" ng-class="{\'selectbox-choose\' : checked(item)}" ng-click="check(item)">{{item.Text}}</div >',
            scope: {
                items: '=',
                selected:'=',
                model:'@'
            },
            controller: function ($scope) {
                if ($scope.selected == undefined || $scope.selected == null) {
                    $scope.selected = [];
                }
                // todo
                $scope.checked = function (item) {
                    for (var i = 0; i < $scope.selected.length; i++) {
                        if ($scope.selected[i].ID == item.ID) {
                            return true;
                        }
                    }

                    return false;
                }

                $scope.check = function (checkitem) {
                    
                    checkitem.checked = !checkitem.checked;

                    if ($scope.model == 'single' && checkitem.checked) {
                        $scope.items.map(function (item) {
                            if (checkitem != item) {
                                item.checked = false;
                            }
                        });
                    }
                }
            },
            link: function (scope, element, attrs) {
                
            }
        }
    });

    //todo more controls
});