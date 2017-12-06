/**
 * Created by liuhuisheng on 2015/2/28.
 */
define(['app'], function (app) {

    app.controller("data/dicCtrl", function ($scope, $page) {

        $scope.treeToolMenus = [
            { id: "new1", type: "button", iconClass: "icon-bell", text: "添加部门", action: "addClick" },
            { id: "new2", type: "button", img: "new.gif", text: "添加子部门", action: "addClick" },
            { type: "separator" },
            { id: "del", type: "button", img: "cross.png", imgdis: "cross.png", text: "删除", action: "test", enabled: false },
            { type: "separator" }];

        $scope.toolMenus = [
            { id: "new", type: "button", img: "new.gif", text: "新增", title: "Tooltip here", action: "addClick" },
            { id: "edit", type: "button", img: "edit.gif", text: "修改", action: "modify" },
            { type: "separator" },
            { id: "reset", type: "button", img: "undo.gif", text: "重置密码", action: "resetPsw" },
            { type: "separator" },
            { id: "del", type: "button", img: "cross.png", imgdis: "cross.png", text: "删除", action: "test", enabled: false },
            { type: "separator" },
            {
                id: "queryType", type: "buttonSelect", img: "new.gif", text: "Select", mode: "select", selected: "edit_cut1",
                options: [
                    { type: "button", id: "edit_cut1", text: "用户名称", img: "cut.gif" },
                    { type: "button", id: "edit_copy2", text: "用户账号", img: "copy.gif" },
                    { type: "button", id: "edit_copy3", text: "用户编号", img: "copy.gif" },
                ]
            },
            { id: "querytext", type: "buttonInput", width: 120 },
            { id: "query", type: "button", img: "page.gif", text: "查询" },
            { type: "separator" },
            { id: "querymore", type: "button", img: "page.gif", text: "高级查询", action: "query" }];


        $scope.treeData = {
            "id": 0,
            "item": [
                {
                    "id": "D0",
                    "text": "项目管理系统",
                    "item": [
                        {
                            "id": "D0-1",
                            "text": "项目类型",
                        },
                        {
                            "id": "D0-2",
                            "text": "工程类型"
                        }
                    ]
                },
                {
                    "id": "D1",
                    "text": "数字档案馆",
                    "item": [
                        {
                            "id": "D1-1",
                            "text": "项目类型",
                        },
                        {
                            "id": "D1-2",
                            "text": "工程类型"
                        }
                    ]
                },
            ]
        };

        $scope.treeDataLoaded = function (tree) {
            console.log('Data has been loaded!');
        };

        $scope.treeHandlers = [
            {
                type: "onClick",
                handler: function (id) {
                    console.log('You have clicked \'' + id + '\'');
                }
            }
        ];

        $scope.query = function () {

            $page.open({
                url: "user/user_filter.html",
                controller: "user/user_filterCtrl",
                params: { filter: $scope.filter }
            });
        }

        $scope.addClick = function (rowid) {
            // need version 5.1
            //var data = $scope.grid.obj.getRowData(rowid);

            $page.open({
                title: 'asdasdasdas',
                url: "user/user_maintain.html",
                controller: 'user/user_maintainCtrl',
                resolve: {
                    params: {
                        rowid: rowid
                    }
                }
            });
        };

        $scope.modify = function () {
            $page.open({
                url: "chat/chat.html",
                controllerUrl: 'chat/chat',
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

        $scope.contextAction = function (event_name) {
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
        $scope.contextMenu1 = {};
        $scope.contextMenu2 = {};
    })
});