define(['app', 'directive/dhtmlx', 'service/user', 'service/org'], function (app) {
    app.controller('user/origanationCtrl', ['$scope', '$page','userService','orgService',
        function ($scope, $page, userService, orgService) {
            
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

            $scope.pageWins = [];

            $scope.addUser = function (rowid) {
                // need version 5.1
                //var data = $scope.grid.obj.getRowData(rowid);
            
                $scope.$apply(function () {
                    $scope.pageWins.push({
                        config: {
                            height: 600,
                            width: 800,
                            text: '新增用户',
                        },
                        view: 'user/user_maintain.html',
                        controller: 'user/user_maintainCtrl',
                        resolve: {
                            rowid: rowid
                        }
                    })
                })
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

            $scope.treeContextAction = {

                "AddSubDept": function (contextId) {
                    var d = new Date();
                    if (orgkey == undefined) {
                        orgkey = $scope.dhxTree.getSelectedItemId()
                    }

                    $scope.dhxTree.insertNewItem(orgkey, d.valueOf(), '新建部门', 0, 0, 0, 0, 'SELECT');

                    $scope.dhxTree.editItem(d.valueOf());
                },
                "AddNextDept": function (contextId) {
                    var d = new Date();
                    if (orgkey == undefined) {
                        orgkey = $scope.dhxTree.getSelectedItemId()
                    }
                    $scope.dhxTree.insertNewNext(orgkey, d.valueOf(), '新建部门', 0, 0, 0, 0, 'SELECT');

                    $scope.dhxTree.editItem(d.valueOf());
                },
                "Rename": function (contextId) {
                    $scope.dhxTree.editItem(contextId);
                },
                "Delete": function (contextId) {
                    $scope.dhxTree.deleteItem(contextId);
                }
            }

            $scope.gridContextAction = {

                "Maintain": function (contextId) {

                },
                "SetPermission": function (contextId) {

                },
                "DisableUser": function (contextId) {
                    $scope.grid.obj.deleteRow(rowId);
                },
                "refreshsize": function (contextId) {
                    $scope.grid.obj.query();
                }
            }

        }]);

    app.controller("user/user_maintainCtrl", function ($scope) {
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