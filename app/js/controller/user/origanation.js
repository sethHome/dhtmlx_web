define(['app', 'directive/dhtmlx', 'service/user', 'service/org'], function (app) {
    app.controller('user/origanationCtrl', ['$scope', '$page', 'userService', 'orgService',
        function ($scope, $page, userService, orgService) {

            $scope.filter = {};

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

            // 创建用户
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
                        scope: $scope,
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

            // 更新用户
            $scope.updateUser = function (userId) {
                
                if (userId == undefined) {
                    userId = $scope.grid.obj.getSelectedRowId();
                }

                if (userId == null || userId == undefined) {
                    dhtmlx.message({
                        type: 'warning',
                        text: "请选择用户！"
                    });

                    return;
                }

                $scope.$apply(function () {
                    $scope.pageWins.push({
                        config: {
                            height: 600,
                            width: 800,
                            text: '用户信息',
                        },
                        scope: $scope,
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

            // 初始化密码
            $scope.initPassword = function (userId) {
                if (userId == undefined) {
                    userId = $scope.grid.obj.getSelectedRowId();
                }
                if (userId == null || userId == undefined) {
                    dhtmlx.message({
                        type: 'warning',
                        text: "请选择用户！"
                    });

                    return;
                }
                dhtmlx.confirm({
                    type: "confirm-warning",
                    text: "确认初始化密码？",
                    callback: function (result) {
                        if (result) {
                            userService.resetPsw(userId).then(function () {
                                dhtmlx.message({
                                    type: 'success',
                                    text: "密码初始化成功！"
                                });
                            })
                        }
                    }
                });
            }

            // 更新部门
            $scope.changeDept = function (userId) {

                $scope.$apply(function () {
                    $scope.pageWins.push({
                        config: {
                            height: 450,
                            width: 250,
                            text: '选择部门',
                        },
                        scope: $scope,
                        view: 'user/choose_dept.html',
                        controller: 'choose_dept_controller',
                        resolve: {
                            "deptHandler": {
                                "choose": function (deptid) {

                                    userService.changeDept(userId, deptid).then(function () {

                                        dhtmlx.message({
                                            type: 'success',
                                            text: "部门变更成功！"
                                        });

                                        $scope.search();
                                    })
                                }
                            }
                        }
                    })
                })
            };

            // 创建部门
            $scope.addDept = function (orgkey) {
                if (orgkey == undefined) {
                    orgkey = $scope.dhxTree.getSelectedItemId()
                }

                $scope.dhxTree.insertNewItem(orgkey, -1, '新建部门', 0, 0, 0, 0, 'SELECT');
            };

            // 删除部门
            $scope.deleteDept = function (orgkey) {
                if (orgkey == undefined) {
                    orgkey = $scope.dhxTree.getSelectedItemId()
                }

                dhtmlx.confirm({
                    type: "confirm-warning",
                    text: "确认删除部门？删除部门后，部门内的用户将转移到公司目录下！",
                    callback: function (result) {
                        if (result) {
                            $scope.dhxTree.deleteItem(orgkey);
                        }
                    }
                });
            };

            // 搜索
            $scope.search = function () {
                $scope.grid.obj.query($scope.filter);
            };

            // 回收站
            $scope.search_disable = function (id,state) {
                $scope.filter.visiable = state;
                $scope.grid.obj.query($scope.filter);
            };

            // grid config
            $scope.grid = {
                obj: {},
                rowid: 'ID',
                columns: [
                    { "header": "编号", "field": "ID","width":"80","align":"center" },
                    { "header": "部门", "field": "DeptID", "width": "200", "type": "filter", "filter": "Dept" },
                    { "header": "姓名", "field": "Name", "width": "120" },
                    { "header": "账号", "field": "Account", "width": "120" }
                ],
                handlers: [
                  {
                      type: "onRowSelect", handler: function (id) {
                          //$scope.grid.obj.deleteRow(id);
                      },
                      type: "onRowDblClicked", handler: function (id) {
                          $scope.updateUser(id);
                      },
                  }
                ]
            };

            // dept tree config
            $scope.treeHandlers = [
               {
                   type: "onClick",
                   handler: function (id) {
                       $scope.$apply(function () {
                           $scope.filter.deptId = id;
                           $scope.grid.obj.query($scope.filter);
                       });
                   }
               }
            ];

            $scope.afterUpdate = function (data) {
                $scope.dhxTree.editItem(data.response);
            }

            $scope.treeContextAction = {

                "AddSubDept": function (orgkey) {
                    $scope.addDept(orgkey);
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
                    $scope.deleteDept(contextId);
                }
            }

            $scope.gridContextAction = {
                "Maintain": function (userId) {
                    $scope.updateUser(userId);
                },
                "ChangeDept": function (userId) {
                    $scope.changeDept(userId);
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

        $scope.$win.progressOn();
        if (params.userId) {
            userService.getUserInfo(params.userId).then(function (userInfo) {
                $scope.userInfo = userInfo;
                $scope.$win.progressOff();
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

        $scope.save = function () {
            $scope.$win.progressOn();
            if (params.userId > 0) {
                userService.update($scope.userInfo).then(function (user) {
                    dhtmlx.message({
                        type: 'success',
                        text: "用户更新成功！"
                    });

                    $scope.searchClick();

                    $scope.$win.progressOff();
                })
            } else {
                userService.create($scope.userInfo).then(function (user) {
                    dhtmlx.message({
                        type: 'success',
                        text: "用户创建成功！"
                    });
                    $scope.searchClick();

                    $scope.$win.progressOff();
                })
            }
        }
    })

    app.controller("choose_dept_controller", function ($scope, orgService, deptHandler) {

        $scope.tools = [
            { id: "choose", type: "button", img: "fa fa-save", text: "选择", action: "choose" }];

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

        $scope.choose = function () {
            $scope.$apply(function () {

                var deptIds = $scope.dhxTree.getAllChecked();
                deptHandler.choose(deptIds);

                $scope.$win.close();
            });
        }
    })
});