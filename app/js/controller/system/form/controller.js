define(['app', 'service/user', 'service/pagemenu'], function (app) {

    app.controller("formController", function ($scope, pagemenuService) {

        $scope.toolMenus = [
            { id: "new", type: "button", img: "fa fa-save", text: "保存", action: "save" },
            { id: "del", type: "button", img: "fa fa-trash-o", text: "删除", action: "remove", title: "同时删除子菜单" }];

        $scope.formDataJson = "";
        function strToJson(str) {
            var json = (new Function("return " + str))();
            return json;
        }
        $scope.$watch("formDataJson", function (newval,oldval) {
            if (newval) {
                //$scope.formData = JSON.parse(newval);
                $scope.formData = strToJson(newval);
            }
        });

        $scope.formData = [];
    })

});