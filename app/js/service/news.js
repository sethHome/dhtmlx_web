define(['app'], function (app) {

    app.factory("newsService", function ($rootScope) {

        var restSrv = app.getRestSrv();

        return {
            getNews: function (id) {

            }
        }
    });
});
