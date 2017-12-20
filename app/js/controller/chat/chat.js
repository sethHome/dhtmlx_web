define(['app', 'service/user'], function (app) {
    
    app.controller("chatController", function ($scope) {
        $scope.msg = "success";

        $scope.toolMenus = [
             { id: "new", type: "button", img: "new.gif", text: "新增", title: "Tooltip here", action: "addClick" },
             { id: "edit", type: "button", img: "edit.gif", text: "修改", action: "modify" },
             { type: "separator" },
             { id: "reset", type: "button", img: "undo.gif", text: "重置密码", action: "resetPsw" },
             { type: "separator" },
             { id: "del", type: "button", img: "cross.png", imgdis: "cross.png", text: "删除", action: "test", enabled: false },
             { type: "separator" },
             { id: "query", type: "button", img: "page.gif", text: "查询", action: "query" }];

        $scope.saveUser = function () {
            $scope.$win.progressOn();
        }

        $scope.treeData = {
            "id": 0,
            "item": [
              {
                  "id": "dataCmps",
                  "text": "Data",
                  "item": [
                    {
                        "id": "Grid",
                        "text": "Grid"
                    },
                    {
                        "id": "Tree",
                        "text": "Tree"
                    }
                  ]
              },
              {
                  "id": "Windows",
                  "text": "Windows"
              },
              {
                  "id": "Layout",
                  "text": "Layout"
              }
            ]
        };

        $scope.treeDataLoaded = function (tree) {
            console.log('Data has been loaded!');
        };

        $scope.treeHandlers = [
          {
              type: "onClick",
              handler: function (id) {
                  console.log('You have clicked \'' + id + '\'');
              }
          }
        ];

        $scope.contextMenu = {};
    })
});