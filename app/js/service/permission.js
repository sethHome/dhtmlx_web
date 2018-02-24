define(['app'], function (app) {
    app.service("permissionService", function ($rootScope) {
        var restSrv = app.getRestSrv();
        return {
            all: function (type, business) {

                return restSrv.all("permission").getList({ type: type, business: business });
            },
            create: function (permission) {
                return restSrv.all("permission").customPOST(permission);
            },
            remove: function (id) {
                return restSrv.one("permission", id).customDELETE();
            },
            update: function (permission) {
                return restSrv.all("permission").customPUT(permission);
            }
        }
    });

});