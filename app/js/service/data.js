define(['app'], function (app) {

    app.factory("dataService", function ($rootScope) {

        var restSrv = app.getRestSrv();

        return {
            all: function () {
                return restSrv.all("enum").getList();
            },
            getEnumItem: function (system,name) {
                return restSrv.one("enum", name).get({ "system": system});
            },
            // enum
            addEnum: function (data) {
                return restSrv.all("enum").customPOST(data, $rootScope.currentBusiness.Key);
            },
            updateEnum: function (data) {
                return restSrv.all("enum").customPUT(data, $rootScope.currentBusiness.Key);
            },
            deleteEnum: function (name) {
                return restSrv.one("enum", name).customDELETE($rootScope.currentBusiness.Key);
            },

            // item
            addItem: function (name, data) {
                return restSrv.all("enum/" + name + '/item').customPOST(data, $rootScope.currentBusiness.Key);
            },
            updateItem: function (name, data) {
                return restSrv.all("enum/" + name + '/item').customPUT(data, $rootScope.currentBusiness.Key);
            },
            deleteItem: function (name, value) {
                return restSrv.one("enum/" + name + '/item', value).customDELETE($rootScope.currentBusiness.Key);
            },

            // tag
            addTag: function (name, value, data) {
                return restSrv.all("enum/" + name + '/item/' + value + '/tag').customPOST(data, $rootScope.currentBusiness.Key);
            },
            updateTag: function (name, value, data) {
                return restSrv.all("enum/" + name + '/item/' + value + '/tag').customPUT(data, $rootScope.currentBusiness.Key);
            },
            deleteTag: function (name, value, key) {
                return restSrv.one("enum/" + name + '/item/' + value + '/tag', key).customDELETE($rootScope.currentBusiness.Key);
            }
        }
    });
});
