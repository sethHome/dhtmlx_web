define(['app', 'service/user', 'service/permission'], function (app) {

    app.controller("permissionController", function ($scope, $page, permissionService) {

        // grid config
        $scope.grid = {
            obj: {},
            rowid: 'ID',
            columns: [
                { "header": "编号", "field": "Key", "width": "250"},
                { "header": "角色", "field": "Name", "width": "200", "align": "center" }
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

    })

    
});