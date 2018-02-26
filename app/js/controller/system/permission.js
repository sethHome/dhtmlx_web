define(['app', 'service/user', 'service/permission'], function (app) {

    app.controller("permissionController", function ($scope, $page, permissionService) {


        permissionService.all().then(function (data) {
            

            var p1 = [], p2 = [], p3 = [];
            angular.forEach(data, function (item) {
                if (item.Type == 1) {
                    p1.push(item);
                } else if (item.Type == 2) {
                    p2.push(item);
                } else {
                    p3.push(item);
                }
            });

            var rows1 = convertTreeData(p1);
            var rows2 = convertTreeData(p2);
            var rows3 = convertTreeData(p3);
            
            $scope.data = {
                "rows": [
                    { "id": -1, data: [{ "value": "UI权限", "image": "folder.gif" }], rows: rows1 },
                    { "id": -2, data: [{ "value": "数据权限", "image": "folder.gif" }], rows: rows2 },
                    { "id": -3, data: [{ "value": "接口权限", "image": "folder.gif" }], rows: rows3 }
                ]
            }; 
            
        });

        var convertTreeData = function (data) {
            var result = [];
            angular.forEach(data, function (item) {
                var row = {
                    id: item.ID,
                    data: []
                };

                if (item.Children && item.Children.length > 0) {
                    row.data.push({ "value": item.Name, "image": "folder.gif" });
                    row.data.push(item.Key);
                    row.data.push(item.CanInherit);
                    
                    row.rows = convertTreeData(item.Children);
                } else {
                    row.data.push(item.Name);
                    row.data.push(item.Key);
                    row.data.push(item.CanInherit);
                }

                result.push(row);
            });

            return result;
        }

        // grid config
        $scope.grid = {
            obj: {},
            rowid: 'id',
            enableTreeGridLines:true,
            columns: [
                { "header": "权限名称", "field": "Name", "width": "250", "type": "tree"},
                { "header": "权限Key", "field": "Key", "width": "300" },
                { "header": "是否可继承", "field": "CanInherit", "width": "100" },
                //{ "header": "Sum", "field": "sum", "width": "100", "type":"ed[=sum]" },
                //
            ],
            handlers: [
                {
                    type: "onRowSelect", handler: function (id) {
                        //$scope.grid.obj.deleteRow(id);
                    },
                    type: "onRowDblClicked", handler: function (id) {
                        //$scope.updateUser(id);


                       
                    },
                }
            ]
        };

        $scope.Expand = function (id, state) {
            if (state) {
                $scope.grid.obj.expandAll();
            } else {
                $scope.grid.obj.collapseAll();
            }
        }

        $scope.Find = function () {

            $scope.grid.obj.expandAll();

            var row = $scope.grid.obj.findCell("UI_Production_Working");
            
            $scope.grid.obj.selectRowById(row[0][0]);
        }

        $scope.gridContextAction = {
            "Add": function (userId) {
                //$scope.updateUser(userId);
                //
                
                //
            },
            "Remove": function (userId) {
                //$scope.changeDept(userId);
            },
            "Update": function (userId) {

            },
        }
    })
});