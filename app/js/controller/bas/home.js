/**
 * Created by liuhuisheng on 2015/1/31.
 */
define(['app'], function (app) {
    app.service('homeApi', function () {
        this.getHomePageGridData = function () {
            var gridData = {
                rows: [
                   { id: 1001, data: ["100", "A Time to Kill", "John Grisham", "12.99", "1", "05/01/1998"] },
                { id: 1002, data: ["1000", "Blood and Smoke", "Stephen King", "0", "1", "01/01/2000"] },
                { id: 1003, data: ["-200", "The Rainmaker", "John Grisham", "7.99", "0", "12/01/2001"] },
                { id: 1004, data: ["350", "The Green Mile", "Stephen King", "11.10", "1", "01/01/1992"] },
                { id: 1005, data: ["700", "Misery", "Stephen King", "7.70", "0", "01/01/2003"] },
                { id: 1006, data: ["-1200", "The Dark Half", "Stephen King", "0", "0", "10/30/1999"] },
                { id: 1011, data: ["100", "A Time to Kill", "John Grisham", "12.99", "1", "05/01/1998"] },
                { id: 1012, data: ["1000", "Blood and Smoke", "Stephen King", "0", "1", "01/01/2000"] },
                { id: 1013, data: ["-200", "The Rainmaker", "John Grisham", "7.99", "0", "12/01/2001"] },
                { id: 1014, data: ["350", "The Green Mile", "Stephen King", "11.10", "1", "01/01/1992"] },
                { id: 1015, data: ["700", "Misery", "Stephen King", "7.70", "0", "01/01/2003"] },
                { id: 1016, data: ["-1200", "The Dark Half", "Stephen King", "0", "0", "10/30/1999"] },
                { id: 1021, data: ["100", "A Time to Kill", "John Grisham", "12.99", "1", "05/01/1998"] },
                { id: 1022, data: ["1000", "Blood and Smoke", "Stephen King", "0", "1", "01/01/2000"] },
                { id: 1023, data: ["-200", "The Rainmaker", "John Grisham", "7.99", "0", "12/01/2001"] },
                { id: 1024, data: ["350", "The Green Mile", "Stephen King", "11.10", "1", "01/01/1992"] },
                { id: 1025, data: ["700", "Misery", "Stephen King", "7.70", "0", "01/01/2003"] },
                { id: 1026, data: ["-1200", "The Dark Half", "Stephen King", "0", "0", "10/30/1999"] },
                { id: 1031, data: ["100", "A Time to Kill", "John Grisham", "12.99", "1", "05/01/1998"] },
                { id: 1032, data: ["1000", "Blood and Smoke", "Stephen King", "0", "1", "01/01/2000"] },
                { id: 1033, data: ["-200", "The Rainmaker", "John Grisham", "7.99", "0", "12/01/2001"] },
                { id: 1034, data: ["350", "The Green Mile", "Stephen King", "11.10", "1", "01/01/1992"] },
                { id: 1035, data: ["700", "Misery", "Stephen King", "7.70", "0", "01/01/2003"] },
                { id: 1036, data: ["-1200", "The Dark Half", "Stephen King", "0", "0", "10/30/1999"] },
                { id: 1041, data: ["100", "A Time to Kill", "John Grisham", "12.99", "1", "05/01/1998"] },
                { id: 1042, data: ["1000", "Blood and Smoke", "Stephen King", "0", "1", "01/01/2000"] },
                { id: 1043, data: ["-200", "The Rainmaker", "John Grisham", "7.99", "0", "12/01/2001"] },
                { id: 1044, data: ["350", "The Green Mile", "Stephen King", "11.10", "1", "01/01/1992"] },
                { id: 1045, data: ["700", "Misery", "Stephen King", "7.70", "0", "01/01/2003"] },
                { id: 1046, data: ["-1200", "The Dark Half", "Stephen King", "0", "0", "10/30/1999"] },
                { id: 1051, data: ["100", "A Time to Kill", "John Grisham", "12.99", "1", "05/01/1998"] },
                { id: 1052, data: ["1000", "Blood and Smoke", "Stephen King", "0", "1", "01/01/2000"] },
                { id: 1053, data: ["-200", "The Rainmaker", "John Grisham", "7.99", "0", "12/01/2001"] },
                { id: 1054, data: ["350", "The Green Mile", "Stephen King", "11.10", "1", "01/01/1992"] },
                { id: 1055, data: ["700", "Misery", "Stephen King", "7.70", "0", "01/01/2003"] },
                { id: 1056, data: ["-1200", "The Dark Half", "Stephen King", "0", "0", "10/30/1999"] }
                ]
            };

            return gridData;
        };
    });

    app.controller('bas/homeCtrl', ['$scope', 'homeApi', '$page', function ($scope, homeApi, $page) {
        $scope.toolbarItems = [
       {
           id: "new", type: "buttonSelect", img: "open.gif", text: "快速访问", options: [
               { id: "new1", type: "button", img: "paste_dis.gif", text: "快速访问1", action: "go" },
               { id: "new2", type: "button", img: "paste_dis.gif", text: "快速访问2", action: "go" },
               { id: "new3", type: "button", img: "paste_dis.gif", text: "快速访问3", action: "go" },
               { id: "new4", type: "button", img: "paste_dis.gif", text: "快速访问4", action: "go" },
               { id: "new5", type: "button", img: "paste_dis.gif", text: "快速访问5", action: "go" },
               { id: "new6", type: "button", img: "paste_dis.gif", text: "快速访问6", action: "go" },
           ]
       },
       {
           id: "task", type: "buttonSelect", img: "open.gif", text: "<span>[2]</span>生产任务", mode: "select", options: [
                 { id: "task1", type: "button", img: "paste_dis.gif", text: "<span>[2]</span>工程任务单", action: "modify" },
                 { id: "task2", type: "button", img: "paste_dis.gif", text: "<span>[2]</span>工程策划", action: "modify" },
                 { id: "task3", type: "button", img: "paste_dis.gif", text: "<span>[2]</span><strong>专业策划</strong>", action: "modify" },
                 { id: "task4", type: "button", img: "paste_dis.gif", text: "<span>[2]</span><span>设计</span>", action: "modify" },
                 { id: "task5", type: "button", img: "paste_dis.gif", text: "<span>[2]</span>校对", action: "modify" },
                 { id: "task6", type: "button", img: "paste_dis.gif", text: "<span>[2]</span>审核", action: "modify" },
                 { id: "task7", type: "button", img: "paste_dis.gif", text: "<span>[2]</span>批准", action: "modify" },
           ]
       },
       {
           id: "form", type: "buttonSelect", img: "open.gif", text: "<span>[2]</span>表单", mode: "select", options: [
                 { id: "form1", type: "button", img: "paste_dis.gif", text: "<span>[2]</span>请假单", action: "modify" },
                 { id: "form2", type: "button", img: "paste_dis.gif", text: "<span>[2]</span>变更单", action: "modify" },
                 { id: "form3", type: "button", img: "paste_dis.gif", text: "<span>[2]</span>联系单", action: "modify" },
                 { id: "form4", type: "button", img: "paste_dis.gif", text: "<span>[2]</span>出版申请单", action: "modify" },
           ]
       },

       { type: "separator" },
       {
           id: "edit", type: "buttonSelect", img: "new.gif", text: "Select", mode: "select", selected: "edit_paste",
           options: [
               { type: "button", id: "edit_cut", text: "项目", img: "cut.gif" },
               { type: "button", id: "edit_copy", text: "工程", img: "copy.gif" },
               { type: "button", id: "edit_paste1", text: "合同", img: "paste.gif" },
               { type: "button", id: "edit_paste", text: "客户", img: "paste.gif" },
               { type: "button", id: "edit_paste2", text: "任务", img: "paste.gif" },
           ]
       },
       { id: "querytext", type: "buttonInput", width: 120 },
       { id: "query", type: "button", img: "page.gif", text: "查询", action: "query" }];

        $scope.go = function (id) {
            $page.tabHandles.openTab({
                id: id,
                text:"123123",
                ctrl: "user/origanation",
                resolve: {
                    justSrv: {
                        aa:11
                    }
                }
            });
        }

        //var tab = app.getTab($element);

        //$scope.test = "hometest1";
        //$scope.data = api.getHomePageGridData();
        //var assetsRoot = app.getAssetsRoot();
        //var toolbar = new dhtmlXToolbarObject('my_toolbar');
        //toolbar.setIconsPath(assetsRoot + "img/btn/");
        //toolbar.addButton("open", 2, "打开", "open.gif", "open_dis.gif");
        //toolbar.addButton("save", 3, "保存", "save.gif", "save_dis.gif");

        //var grid = new dhtmlXGridObject('gridbox');
        //grid.setHeader("Sales, Book Title, Author");
        //grid.setInitWidths("100,250,*")
        //grid.setColAlign("right,left,left")
        //grid.setColTypes("ro,ed,ed");
        //grid.setColSorting("int,str,str")
        //grid.enablePaging(true, 10, 5, "pagingArea", true, "recinfoArea");
        //grid.setPagingSkin("toolbar", "dhx_skyblue");
        //grid.setImagePath(assetsRoot + "lib/dhtmlx/v403_pro/skins/skyblue/imgs/");
        //grid.init();
        //grid.i18n.paging = {
        //    results: "结果",
        //    records: "当前",
        //    to: "-",
        //    page: "页",
        //    perpage: "行每页",
        //    first: "首页",
        //    previous: "上一页",
        //    found: "找到数据",
        //    next: "下一页",
        //    last: "末页",
        //    of: " 的 ",
        //    notfound: "No Records Found"
        //};
        //var resizeGrid = function () {
        //    $("#gridbox").height($(tab.cell).height() - 142);
        //    grid.setSizes();
        //};
        //$(window).resize(resizeGrid);
        //resizeGrid();

        //$scope.$watch('data', function (newValue, oldValue) {
        //    grid.clearAll();
        //    grid.parse(newValue, "json");
        //});
    }]);
    
});