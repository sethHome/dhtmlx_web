define(['app'], function (app) {
    app.service("pagemenuService", function ($rootScope) {
        var restSrv = app.getRestSrv();
        return {
            getMenus: function () {
                return restSrv.all("menu").getList({ business:  "System5" });
            },

            addMenu: function (module, parentKey) {
                module.BusinessKey = $rootScope.currentBusiness.Key;
                module.ParentKey = parentKey;
                return restSrv.all("menu").customPOST(module);
            },
            removeMenu: function (key) {
                return restSrv.all("menu").customDELETE("", { Key: key });
            },
            updateMenu: function (module) {
                return restSrv.all("menu").customPUT(module);
            },
            favorites: function (key) {
                return restSrv.one("menu", key).customPUT(undefined, 'favorites');
            },
            removeFavorites: function (key) {
                return restSrv.one("menu", key).customDELETE('favorites');
            }
        }
    });

});