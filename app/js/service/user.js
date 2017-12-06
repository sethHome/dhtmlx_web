﻿/**
 * Created by liuhuisheng on 2015/2/28.
 * todo using angular-resource to access data
 */
define(['app'], function (app) {
    app.service("userService", function ($rootScope) {
        var restSrv = null;
        return {
            getUsers: function () {
                return restSrv.all("user").getList();
            },
            getUsersEx: function (withdept, withrole, withpermission, withsys) {
                return restSrv.all("user").customGET("ex", {
                    "withdept": withdept,
                    "withrole": withrole,
                    "withpermission": withpermission,
                    "withsys": withsys
                });
            },
            setPermission: function (userID, permission) {
                return restSrv.one("user", userID).customPUT(permission, $rootScope.currentBusiness.Key + "/permission");
            },
            getBusiness: function (userID) {
                return restSrv.one("user", userID).customGET("business");
            },
            setProduction: function (userID, info) {
                return restSrv.one("user", userID).customPUT(info, "production");
            },
            update: function (user) {
                return restSrv.one("user", user.ID).customPUT(user);
            },
            create: function (user) {
                return restSrv.all("user").post(user);
            },
            disable: function (id) {
                return restSrv.one("user", id).customPUT({}, "disable");
            },
            enable: function (id) {
                return restSrv.one("user", id).customPUT({}, "enable");
            },
            resetPsw: function (id) {
                return restSrv.one("user", id).customPUT({}, "resetpsw");
            },
            checkAccount: function (account) {
                return restSrv.one("user", account).customGET("check");
            }

        }
    });

});