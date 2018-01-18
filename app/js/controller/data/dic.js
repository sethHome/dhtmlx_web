define(['app', 'service/data'], function (app) {

    app.controller("data/dicCtrl", function ($scope, $page, dataService) {

        $scope.loaded = function (layout) {

            layout.cells("a").progressOn();

            var paraseTreeData = function (nodes) {
                var newNodes = [];
                angular.forEach(nodes, function (sysNode) {
                    var treeNode = {
                        id: sysNode.Key,
                        text: sysNode.Key,
                        open: true,
                        userdata: {
                            name1: "value1", name2: "value2"
                        },
                        item: []
                    };
                    angular.forEach(sysNode.Enums, function (enumNode) {
                        treeNode.item.push({
                            id: enumNode.Key,
                            text: enumNode.Text,
                            userdata: {
                                name1: "value1", name2: "value2"
                            }
                        });
                    });
                    newNodes.push(treeNode);
                });
                return newNodes;
            }

            dataService.all().then(function (data) {
                var items = paraseTreeData(data);
                $scope.treeData = {
                    "id": 0,
                    "item": items
                };
                layout.cells("a").progressOff();
            })
        }

        $scope.treeHandlers = [
            {
                type: "onClick",
                handler: function (id, a, b, c) {
                   
                    var tree = $scope.dhxTree;
                    var pid = tree.getParentId(id);

                    dataService.getEnumItem(pid, id).then(function (data) {
                      
                        $scope.enumItems = {
                            //pageCount : 0,
                            rows: data.Items,
                            total: data.Items.length
                        }
                    });
                }
            }
        ];

        $scope.treeContextAction = {

            "AddData": function () {

            },
            "RemoveData": function () {

            }
        };

        $scope.Query = function () {

        }

        $scope.AddItem = function () {
            $scope.grid.obj.addRow($scope.grid.obj.uid(), ["*", "New Value","0"], 99);
        };
        $scope.AddAttr = function () {
            $scope.grid2.obj.addRow($scope.grid2.obj.uid(), ["*", "New Value"], 99);
        };

        $scope.RemoveItem = function () {
            
            $scope.grid.obj.deleteSelectedItem()
        };
        $scope.RemoveAttr = function () {
            $scope.grid2.obj.deleteSelectedItem()
        };
        
        $scope.grid = {
            obj: {
                unload: function () {
                    //...
                }
            },
            handlers: [
                {
                    type: "onRowSelect", handler: function (id, index) {
                        var rowIndex = $scope.grid.obj.getRowIndex(id);

                        var tags = $scope.enumItems.rows[rowIndex].Tags;

                        var tagSource = { rows: [], total:0};
                        for (var tag in tags) {
                            
                            tagSource.rows.push({ Key: tag, Value: tags[tag] });
                        }
                        $scope.$apply(function () {
                            tagSource.total = tagSource.rows.length; 
                            $scope.enumItemAttrs = tagSource;
                        });
                    }
                }
            ]
        };

        //$scope.grid.enableSmartRendering(true);

        $scope.grid2 = {
            obj: {
                unload: function () {
                    //...
                }
            },
            handlers: [
                {
                    type: "onRowSelect", handler: function (id, index) {


                    }
                }
            ]
        };
    })
});