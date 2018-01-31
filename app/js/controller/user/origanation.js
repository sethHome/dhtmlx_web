define(['app', 'directive/dhtmlx', 'service/user', 'service/org'], function (app) {
    app.controller('user/origanationCtrl', ['$scope', '$page', 'userService', 'orgService',
        function ($scope, $page, userService, orgService) {

            $scope.loaded = function (layout) {

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
                            open: 1
                        };
                        newNode.item = paraseTreeData(node.SubDepartments);
                        newNodes.push(newNode);
                    });
                    return newNodes;
                }
            };

            $scope.pageWins = [];

            $scope.addUser = function (deptId) {
                // need version 5.1
                //var data = $scope.grid.obj.getRowData(rowid);

                if (deptId == undefined) {
                    deptId = $scope.dhxTree.getSelectedItemId()
                }

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
                            "params": {
                                "deptId": deptId
                            }
                        }
                    })
                })
            };
            $scope.updateUser = function (userId) {
                $scope.$apply(function () {
                    $scope.pageWins.push({
                        config: {
                            height: 600,
                            width: 800,
                            text: '用户信息',
                        },
                        view: 'user/user_maintain.html',
                        controller: 'user/user_maintainCtrl',
                        resolve: {
                            "params": {
                                "userId": userId
                            }
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
                "Maintain": function (userId) {
                    $scope.updateUser(userId);
                },
                "SetPermission": function (userId) {

                },
                "DisableUser": function (userId) {
                    $scope.grid.obj.deleteRow(userId);
                },
                "refreshsize": function (userId) {
                    $scope.grid.obj.query();
                }
            }

        }]);

    app.controller("user/user_maintainCtrl", function ($scope, orgService, userService, params) {

        $scope.userInfo = {};

        var loadDeptInfo = function (deptId) {
            $scope.userInfo.Dept = { "ID": params.deptId };
            orgService.getDeptName(params.deptId).then(function (name) {
                $scope.userInfo.Dept.Name = name;
            })
        }

        if (params.userId) {
            userService.getUserInfo(params.userId).then(function (userInfo) {
                $scope.userInfo = userInfo;
            })
        } else if (params.deptId) {
            loadDeptInfo(params.deptId);
        }

        orgService.getRole().then(function (data) {
            $scope.roles = data.map(function (item) {
                return {
                    ID: item.ID,
                    Text: item.Name
                }
            });
        });
        orgService.getBusiness().then(function (data) {
            $scope.allBusiness = data.map(function (item) {
                return {
                    ID: item.ID,
                    Text: item.Name
                }
            });
        });

        $scope.toolMenus = [
             { id: "new", type: "button", img: "fa fa-save", text: "保存", title: "Tooltip here", action: "saveUser" },
        ];

        $scope.save = function () {
            $scope.$win.progressOn();
            if (params.userId > 0) {
                userService.update($scope.userInfo).then(function (user) {
                    dhtmlx.message({
                        type: 'success',
                        text: "用户更新成功！"
                    });
                    $scope.$win.progressOff();
                })
            } else {
                userService.create($scope.userInfo).then(function (user) {
                    dhtmlx.message({
                        type: 'success',
                        text: "用户创建成功！"
                    });
                    $scope.$win.progressOff();
                })
            }
            
        }
    })
});