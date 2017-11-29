/**
 * Created by liuhuisheng on 2015/2/28.
 */
define(['app', 'directive/dhtmlx', 'service/user'], function (app) {
    app.controller('user/origanationCtrl', ['$scope', '$element', '$http', '$compile', 'userService',
        function ($scope, $element, $http, $compile, userService) {
            $scope.grid = {
                obj: {
                    unload: function () {
                        //...
                    }
                },
                handlers: [
                  {
                      type: "onRowSelect", handler: function (id) {
                          //$scope.grid.obj.deleteRow(id);
                      }
                  }
                ]
            };
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
        }]);


});