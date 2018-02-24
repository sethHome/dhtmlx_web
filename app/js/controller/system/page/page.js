define(['app', 'service/user', 'service/pagemenu'], function (app) {

    app.controller("pageController", function ($scope, $page, pagemenuService) {

        $scope.pageWins = [];
        $scope.menuAttrs = {};

        $scope.loaded = function (layout) {

            layout.cells("a").progressOn();

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

                layout.cells("a").progressOff();
            });
        }
  
        $scope.treeHandlers = [
            {
                type: "onClick",
                handler: function (id) {
                    //var a = $scope.dhxTree.getUserData(id);
                    $scope.currentMenu = $scope.menuAttrs[id];
                    $scope.$apply();
                }
            }
        ];

        $scope.treeContextAction = {

            "Add": function (orgkey) {
                $scope.dhxTree.insertNewItem(orgkey, -1, '新建菜单', 0, 0, 0, 0, 'SELECT');
            },
            "AddNext": function (contextId) {

            },
            "Delete": function (contextId) {
                $scope.dhxTree.deleteItem(contextId);
            }
        }

        $scope.OpenMenuList = function () {

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

        $scope.Save = function () {
            pagemenuService.updateMenu($scope.currentMenu).then(function () {
                dhtmlx.message({
                    text: "保存成功！"
                })
            });
        }
        $scope.Remove = function () {
            var id = $scope.dhxTree.getSelectedItemId();
            $scope.dhxTree.deleteItem(id);
        }

    })

    app.controller("pageButtonCtrl", function ($scope, menuID) {
        $scope.menuID = menuID;
        //ID,Group,Text,Type,Action,Icon,Title
        //ID,GroupName,BtnText,BtnType,BtnAction,BtnIcon,BtnTitle
        $scope.grid = {
            rowid: 'ID',
            columns: [
                { "header": "Order", "field": "OrderIndex", "width": "60", "type": "edn" },
                { "header": "Key", "field": "Key", "width": "100", "type": "edtxt" },
                { "header": "Group", "field": "GroupName", "width": "120", "type": "edtxt" },
                { "header": "Text", "field": "BtnText", "width": "120", "type": "ed" },
                { "header": "Type", "field": "BtnType", "width": "100", "type": "edtxt" },
                { "header": "Action", "field": "BtnAction", "width": "100", "type": "edtxt" },
                { "header": "Icon", "field": "BtnIcon", "width": "120", "type": "ed" },
                { "header": "Title", "field": "BtnTitle", "width": "120", "type": "ed" },
                { "header": "Options", "field": "OptionEx", "width": "200", "type": "ed" }
            ]
        };

        $scope.AddMenu = function () {
            var id = new Date().valueOf();
            var index = $scope.grid.obj.getRowsNum();

            $scope.grid.obj.addRow(id,
                [0,'', '分组名称', '按钮名称', 'button', 'Action','fa fa-file-o'],
                index);
        }

        $scope.RemoveMenu = function () {
            $scope.grid.obj.deleteSelectedRows();
        }

        $scope.Reflesh = function () {
            $scope.grid.obj.query();
        }
    })
});