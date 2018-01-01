define(['app', 'service/user', 'service/pagemenu'], function (app) {

    app.controller("pageController", function ($scope, pagemenuService) {

        $scope.toolMenus = [
            { id: "new", type: "button", img: "fa fa-save", text: "保存", action: "save" },
            { id: "del", type: "button", img: "fa fa-trash-o", text: "删除", action: "remove", title: "同时删除子菜单" }];

        $scope.menuAttrs = {};

        var convertMenu = function (data) {
            var menus = [];
            angular.forEach(data, function (item) {
                $scope.menuAttrs[item.Key] = item;

                var subMenus = convertMenu(item.SubMenus);
                
                menus.push({
                    id: item.MenuID,
                    text: item.Text,
                    icons: item.Icon ? item.Icon : 'fa fa-file',
                    Test1: "value1",
                    Test2: "value2",
                    item: subMenus
                });
            });

            return menus;
        }

        pagemenuService.getMenus().then(function (data) {
            var menus = convertMenu(data);
            
            $scope.treeData = { "id": 0, "item": menus };
        });

  
        $scope.treeDataLoaded = function (tree) {
            console.log('Data has been loaded!');
        };

        $scope.treeHandlers = [
            {
                type: "onClick",
                handler: function (id) {


                    var a = $scope.dhxTree.getUserData(id);
                    
                    $scope.currentMenu = $scope.menuAttrs[id];
                    $scope.$apply();
                }
            }
        ];

        $scope.add = function (orgkey) {
            var d = new Date();
            if (orgkey == undefined) {
                orgkey = $scope.dhxTree.getSelectedItemId()
            }

            $scope.dhxTree.insertNewItem(orgkey, d.valueOf(), '新建菜单', 0, 0, 0, 0, 'SELECT');

            //$scope.dhxTree.editItem(d.valueOf());
        }

        $scope.contextMenuExcute = function (id) {
            var orgKey = $scope.dhxTree.contextID;
            $scope[id](orgKey);
        }

        $scope.contextMenu = {};

    })

    app.controller("pageMaintainController", function ($scope, info) {
        $scope.currentMenu = info;
    })
});