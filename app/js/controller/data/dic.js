/**
 * Created by liuhuisheng on 2015/2/28.
 */
define(['app', 'service/data'], function (app) {

    app.controller("data/dicCtrl", function ($scope, $page, dataService) {

        $scope.treeToolMenus = [
           {
               id: "queryType", type: "buttonSelect", img: "new.gif", text: "Select", mode: "select", selected: "edit_cut0",
               options: [
                   { type: "button", id: "edit_cut0", text: "全部", img: "cut.gif" },
                   { type: "button", id: "edit_cut1", text: "System2", img: "cut.gif" },
                   { type: "button", id: "edit_copy2", text: "System3", img: "copy.gif" },
                   { type: "button", id: "edit_copy3", text: "System4", img: "copy.gif" },
               ]
           },
            { id: "querytext", type: "buttonInput", width: 120 },
            { id: "query", type: "button", img: "page.gif", text: "查询" }];

        $scope.itemToolMenus = [
            { id: "new", type: "button", img: "new.gif", text: "添加", title: "Tooltip here", action: "addItem" },
            { id: "del", type: "button", img: "cross.png", imgdis: "cross.png", text: "删除", action: "removeItem"},
            ];
        $scope.attrToolMenus = [
            { id: "new", type: "button", img: "new.gif", text: "添加", title: "Tooltip here", action: "addAttr" },
            { id: "del", type: "button", img: "cross.png", imgdis: "cross.png", text: "删除", action: "removeAttr" },
        ];
        dataService.all().then(function (data) {
            var items = paraseTreeData(data);
            $scope.treeData = {
                "id": 0,
                "item": items
            };

        })

        var paraseTreeData = function (nodes) {
            var newNodes = [];
            angular.forEach(nodes, function (sysNode) {
                var treeNode = {
                    id: sysNode.Key,
                    text: sysNode.Key,
                    open : true,
                    userdata: {
                        name1: "value1", name2: "value2"
                    },
                    item:[]
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

        $scope.treeDataLoaded = function (tree) {
            console.log('Data has been loaded!');
        };

        $scope.treeHandlers = [
            {
                type: "onClick",
                handler: function (id, a, b, c) {
                   
                    var tree = $scope.dhxTree;
                    var pid = tree.getParentId(id);
                    console.log(pid);


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

        $scope.query = function () {

            $page.open({
                url: "user/user_filter.html",
                controller: "user/user_filterCtrl",
                params: { filter: $scope.filter }
            });
        }

        $scope.addItem = function () {
            $scope.grid.obj.addRow($scope.grid.obj.uid(), ["*", "New Value","0"], 99);
        };
        $scope.addAttr = function () {
            $scope.grid2.obj.addRow($scope.grid2.obj.uid(), ["*", "New Value"], 99);
        };

        $scope.removeItem = function () {
            
            $scope.grid.obj.deleteSelectedItem()
        };
        $scope.removeAttr = function () {
            $scope.grid2.obj.deleteSelectedItem()
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