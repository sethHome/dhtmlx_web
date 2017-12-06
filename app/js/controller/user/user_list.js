/**
 * Created by liuhuisheng on 2015/2/28.
 */
define(['app', 'directive/dhtmlx', 'service/user'], function (app) {
    app.controller('user/user_listCtrl', ['$scope', '$element', '$http', '$compile', 'userService',
        function ($scope, $element, $http, $compile, userService) {

            $scope.filter = {};

            $scope.toolMenus = [
                { id: "new", type: "button", img: "new.gif", text: "新增", title: "Tooltip here", action: "addClick" },
                { id: "edit", type: "button", img: "edit.gif", text: "修改", action: "modify" },
                { type: "separator" },
                { id: "reset", type: "button", img: "undo.gif", text: "重置密码", action: "resetPsw" },
                { type: "separator" },
                { id: "del", type: "button", img: "cross.png", imgdis: "cross.png", text: "删除", action: "test", enabled: false },
                { type: "separator" },
                { id: "query", type: "button", img: "page.gif", text: "查询", action: "query" }];


            $scope.menuAction = function (menuId, rowId) {
                alert(menuId + "_"+  rowId);
            }
           
            $scope.addClick = function (rowid) {
                // need version 5.1
                //var data = $scope.grid.obj.getRowData(rowid);
                
                $scope.openWindow({
                    url: "app/views/user/user_maintain.html",
                    controller: 'user/user_maintainCtrl',
                    params: { rowid: rowid }
                });
            };

            $scope.modify = function () {
                $scope.openWindow({
                    text: {
                        head: '聊天',
                        status: '创建者:tang',
                    },
                    size: {
                        width: 800,
                        height: 500
                    },
                    modal: false,
                    url: "app/views/chat/chat.html",
                    controller: 'chatController',
                });
            };

            $scope.searchClick = function () {
                $scope.grid.query($scope.form);
            };

            $scope.clearClick = function () {
                for (var i in $scope.form)
                    $scope.form[i] = null;

                $scope.grid.query($scope.form);
            };

            //$scope.grid.enableSmartRendering(true);

            $scope.grid = {
                obj: {
                    unload: function () {
                        //...
                    }
                },
                handlers: [
                  {
                      type: "onRowSelect", handler: function (id) {
                          //$scope.grid.obj.deleteRow(id);
                      }
                  }
                ]
            };

            $scope.contextAction = function(event_name) {
                var rowId = $scope.grid.obj.contextID.split("_")[0]; //rowId_colInd
                
                switch (event_name) {
                    case "update": {
                        $scope.addClick(rowId);
                        break;
                    }
                    case "refreshsize": {
                        $scope.grid.obj.query();
                        break;
                        //$scope.grid.obj.setSizes();
                    }
                    case "remove": {
                        $scope.grid.obj.deleteRow(rowId);
                        break;
                    }
                }
            };

            $scope.contextMenu = {};
            $scope.gridData = {
                rows: [
                  { id: 1, data: ["Click a row", "John Grasham", "100"] },
                  { id: 2, data: ["to have it", "Stephen Pink", "2000"] },
                  { id: 3, data: ["deleted", "Terry Brattchet", "3000"] },
                  { id: 4, data: ["La la la", "Isaac Zimov", "4000"] },
                  { id: 5, data: ["La la la", "Sax Pear", "5000"] }
                ]
            };
        }]);

    app.controller("user/user_maintainCtrl", function ($scope) {
        if ($scope.$params.rowid > 0) {
            $scope.title = "更新用户";
        } else {
            $scope.title = "新增用户";
        }
        
        $scope.toolMenus = [
             { id: "new", type: "button", img: "save.gif", text: "保存", title: "Tooltip here", action: "saveUser" },
             ];

        $scope.saveUser = function () {
            $scope.$win.progressOn();
        }
    })
});