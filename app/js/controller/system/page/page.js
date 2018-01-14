define(['app', 'service/user', 'service/pagemenu'], function (app) {

    app.controller("pageController", function ($scope, $page, pagemenuService) {

        $scope.pageWins = [];
        $scope.toolMenus = [
            { id: "new", type: "button", img: "fa fa-save", text: "保存", action: "save" },
            { id: "del", type: "button", img: "fa fa-trash-o", text: "删除", action: "remove", title: "同时删除子菜单" },
            { id: "btns", type: "button", img: "fa fa-list", text: "页面按钮", action: "viewBtns" }];

        $scope.menuAttrs = {};

        var convertMenu = function (data) {
            var menus = [];
            angular.forEach(data, function (item) {
                $scope.menuAttrs[item.MenuID] = item;

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

        $scope.viewBtns = function () {

            var menuID = $scope.dhxTree.getSelectedItemId()

            $scope.$apply(function () {
                $scope.pageWins.push({

                    config: {
                        height: 600,
                        width: 800,
                        text: '按钮',
                    },
                    view: "system/page/buttons.html",
                    controller: 'pageButtonCtrl',
                    resolve: {
                        menuID: menuID
                    }
                })
            })
        }

        $scope.add = function (orgkey) {

            if (orgkey == undefined) {
                orgkey = $scope.dhxTree.getSelectedItemId()
            }

            $scope.dhxTree.insertNewItem(orgkey, -1, '新建菜单', 0, 0, 0, 0, 'SELECT');
        }

        $scope.remove = function (orgkey) {
            
            $scope.dhxTree.deleteItem(orgkey);
        }

        $scope.save = function () {
            pagemenuService.updateMenu($scope.currentMenu).then(function () {
                dhtmlx.message({
                    text: "保存成功！"
                })
            });
        }

        $scope.contextMenuExcute = function (id) {
            var orgKey = $scope.dhxTree.contextID;
            $scope[id](orgKey);
        }

        $scope.contextMenu = {};

    })

    app.controller("pageButtonCtrl", function ($scope, menuID) {
        $scope.menuID = menuID;

        $scope.grid = {};

        $scope.toolMenus = [
            { id: "addBtnID", type: "button", img: "fa fa-save", text: "添加", title: "Tooltip here", action: "addBtn" },
        ];

        $scope.addBtn = function () {
            var id = new Date().valueOf();
            var index = $scope.grid.obj.getRowsNum();

            $scope.grid.obj.addRow(id,
                [0, '分组名称', '按钮名称', 'button', 'Action','fa fa-file-o'],
                index);
        }
    })
});