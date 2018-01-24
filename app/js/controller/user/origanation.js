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
                            id: node.ID,
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

            $scope.afterUpdate = function (data) {

                $scope.dhxTree.editItem(data.response);
            }

            $scope.treeContextAction = {

                "AddSubDept": function (orgkey) {

                    if (orgkey == undefined) {
                        orgkey = $scope.dhxTree.getSelectedItemId()
                    }

                    $scope.dhxTree.insertNewItem(orgkey, -1, '新建部门', 0, 0, 0, 0, 'SELECT');
                },
                "AddNextDept": function (orgkey) {
                    
                    if (orgkey == undefined) {
                        orgkey = $scope.dhxTree.getSelectedItemId()
                    }

                    $scope.dhxTree.insertNewNext(orgkey, -1, '新建部门', 0, 0, 0, 0, 'SELECT');
                },
                "AddUser": function (deptId) {
                    $scope.addUser(deptId);
                },
                "Rename": function (contextId) {
                    $scope.dhxTree.editItem(contextId);
                },
                "Delete": function (contextId) {
                    $scope.dhxTree.deleteItem(contextId);

                    // deleteChildItems
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

    app.controller("user/user_maintainCtrl", function ($scope, orgService) {
        //if (params.rowid > 0) {
        //    $scope.title = "更新用户";
        //} else {
        //    $scope.title = "新增用户";
        //}

        orgService.getRole().then(function (data) {
            $scope.roles = data.map(function (item) {
                return {
                    ID: item.Key,
                    Text: item.Name
                }
            });
        });
        orgService.getBusiness().then(function (data) {
            $scope.allBusiness = data.map(function (item) {
                return {
                    ID: item.Key,
                    Text: item.Name
                }
            });
        });

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