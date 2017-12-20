define(['app', 'service/user', 'service/pagemenu'], function (app) {

    app.controller("pageController", function ($scope, pagemenuService) {
        $scope.msg = "success";

        
        $scope.menuAttrs = {};

        var convertMenu = function (data) {
            var menus = [];
            angular.forEach(data, function (item) {
                $scope.menuAttrs[item.Key] = item;

                var subMenus = convertMenu(item.SubMenus);
                
                menus.push({
                    id: item.Key,
                    text: item.Text,
                    icons: item.Icon ? item.Icon : 'fa fa-file',
                    item: subMenus,
                    
                });
            });

            return menus;
        }

        pagemenuService.getMenus().then(function (data) {
            $scope.treeData = { "id": 0, "item": convertMenu(data)};
        });

  
        $scope.treeDataLoaded = function (tree) {
            console.log('Data has been loaded!');
        };

        $scope.treeHandlers = [
            {
                type: "onClick",
                handler: function (id) {

                    $scope.page = {
                        view: 'system/page/maintain.html',
                        controller: 'pageMaintainController',
                        resolve: {
                            info: $scope.menuAttrs[id]
                        }
                    }

                    $scope.$apply();
                    //getUserData
                    console.log('You have clicked \'' + id + '\'');
                }
            }
        ];

        $scope.contextMenu = {};

        $scope.page = {
            view: 'system/page/maintain.html',
            controller: 'pageMaintainController',
            resolve: {
                info: {}
            }
        }

        $scope.toolMenus = [
            { id: "new", type: "button", img: "new.gif", text: "新增", title: "Tooltip here", action: "addClick" },
            { id: "edit", type: "button", img: "edit.gif", text: "修改", action: "modify" },
            { type: "separator" },
            { id: "reset", type: "button", img: "undo.gif", text: "重置密码", action: "resetPsw" },
            { type: "separator" },
            { id: "del", type: "button", img: "cross.png", imgdis: "cross.png", text: "删除", action: "test", enabled: false },
            { type: "separator" },
            { id: "query", type: "button", img: "page.gif", text: "查询", action: "query" }];


    })

    app.controller("pageMaintainController", function ($scope, info) {
        $scope.currentMenu = info;

        
    })
});