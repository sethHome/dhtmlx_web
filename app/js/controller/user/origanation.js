/**
 * Created by liuhuisheng on 2015/2/28.
 */
define(['app', 'directive/dhtmlx', 'service/user', 'service/org'], function (app) {
    app.controller('user/origanationCtrl', ['$scope', '$page','userService','orgService',
        function ($scope, $page, userService, orgService) {
            
            //$scope.treeToolMenus = [
            //    { id: "new1", type: "button", img: "fa fa-plus", text: "添加部门", action: "addNextOrg" },
            //    { id: "new2", type: "button", img: "fa fa-plus", text: "添加子部门", action: "addChildOrg" },
            //    { type: "separator" },
            //    { id: "del", type: "button", img: "fa fa-trash-o",text: "删除", action: "test" }];

            //$scope.toolMenus = [
            //    { id: "new", type: "button", img: "fa fa-plus", text: "新增", title: "Tooltip here", action: "addClick" },
            //    { id: "edit", type: "button", img: "fa fa-edit", text: "修改", action: "modify" },
            //   { type: "separator" },
            //   { id: "reset", type: "button", img: "fa fa-refresh", text: "重置密码", action: "resetPsw" },
            //   { id: "del", type: "button", img: "fa fa-trash-o", text: "删除", action: "test" },
            //   { type: "separator" },
            //   {
            //       id: "queryType", type: "buttonSelect", img: "fa fa-filter", text: "Select", mode: "select", selected: "edit_cut1",
            //       options: [
            //           { type: "button", id: "edit_cut1", text: "用户名称", img: "fa fa-filter" },
            //           { type: "button", id: "edit_copy2", text: "用户账号", img: "fa fa-filter" },
            //           { type: "button", id: "edit_copy3", text: "用户编号", img: "fa fa-filter" },
            //       ]
            //   },
            //   { id: "querytext", type: "buttonInput", width: 120 },
            //   { id: "query", type: "button", img: "fa fa-search", text: "查询"},
            //   { id: "querymore", type: "button", img: "fa fa-list-alt", text: "高级查询", action: "query" }];

            $scope.orgMenus = [
                { id: "new", type: "button", img: "new.gif", text: "新增", title: "Tooltip here", action: "addClick" },
               { id: "edit", type: "button", img: "edit.gif", text: "修改", action: "modify" },
            ];

            $scope.loaded = function(layout) {
                
                layout.cells("a").progressOn();

                orgService.getDepartment().then(function (data) {
                    var orgs = paraseTreeData(data);
                    $scope.treeData = {
                        "id": 0,
                        "item": orgs
                    };

                    layout.cells("a").progressOff();
                });

                var paraseTreeData = function (nodes) {
                    var newNodes = [];
                    angular.forEach(nodes, function (node) {
                        var newNode = {
                            id: node.Key,
                            text: node.Name,
                            open:1
                        };
                        newNode.item = paraseTreeData(node.SubDepartments);
                        newNodes.push(newNode);
                    });
                    return newNodes;
                }
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
                var data = $scope.grid.obj.getRowData(rowid);

                $page.open({config: {
                    height: 500,
                    width: 500,
                    text: '新增用户',
                    },
                    view: 'user/user_maintain.html',
                    controller: 'user/user_maintainCtrl',
                    resolve: {
                        params: {
                            rowid: rowid
                        }
                    }
                });
                //$page.open2({
                //    title:'新增用户',
                //    url: "user/user_maintain.html",
                //    controller: 'user/user_maintainCtrl',
                //    resolve:{
                //        params:{
                //            rowid: rowid
                //        }
                //    }
                //});
            };

            $scope.modify = function () {
                //$page.open({
                //    height: 500,
                //    width: 800,
                //    url: "chat/chat.html",
                //    controllerUrl:'chat/chat',
                //    controller: 'chatController',
                //});


                $page.open({
                    config: {
                        height: 500,
                        width: 800,
                        text: '聊天',
                    },
                    view: "chat/chat.html",
                    controllerUrl: 'chat/chat',
                    controller: 'chatController'
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

            $scope.treeHand = function (id) {
                var orgKey = $scope.dhxTree.contextID; 
                $scope[id](orgKey);
            }

            $scope.addChildOrg = function (orgkey) {
                var d = new Date();
                if (orgkey == undefined) {
                    orgkey = $scope.dhxTree.getSelectedItemId()
                }
                
                $scope.dhxTree.insertNewItem(orgkey, d.valueOf(), '新建部门', 0, 0, 0, 0, 'SELECT');

                $scope.dhxTree.editItem(d.valueOf());
            }

            $scope.addNextOrg = function (orgkey) {
                var d = new Date();
                if (orgkey == undefined) {
                    orgkey = $scope.dhxTree.getSelectedItemId()
                }
                $scope.dhxTree.insertNewNext(orgkey, d.valueOf(), '新建部门', 0, 0, 0, 0, 'SELECT');

                $scope.dhxTree.editItem(d.valueOf());
            }

            $scope.rename = function (orgkey) {
                $scope.dhxTree.editItem(orgkey);
            }

            $scope.deleteOrg = function (orgkey) {
                $scope.dhxTree.deleteItem(orgkey);
            }

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
        }]);

    app.controller("user/user_maintainCtrl", function ($scope,params) {
        //if (params.rowid > 0) {
        //    $scope.title = "更新用户";
        //} else {
        //    $scope.title = "新增用户";
        //}

        $scope.toolMenus = [
             { id: "new", type: "button", img: "fa fa-save", text: "保存", title: "Tooltip here", action: "saveUser" },
        ];

        $scope.saveUser = function () {
            $scope.$win.progressOn();
        }
    })

    app.controller("user/user_filterCtrl", function ($scope) {
        $scope.tools = [
           { id: "new", type: "button", img: "fa fa-query", text: "查询", title: "Tooltip here", action: "query" },
        ];

        $scope.saveUser = function () {
            $scope.$win.progressOn();
        }
    })


});