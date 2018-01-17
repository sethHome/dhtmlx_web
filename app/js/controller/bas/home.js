/**
 * Created by liuhuisheng on 2015/1/31.
 */
define(['app'], function (app) {

    app.controller('bas/homeCtrl', ['$scope', 'myApi', '$page', function ($scope, myApi, $page) {
        //$scope.toolbarItems = [
        //    {
        //        id: "new", type: "buttonSelect", img: "open.gif", text: "快速访问", options: [
        //            {
        //                id: "new1", type: "button", img: "fa fa-file-o", text: "经营",
        //                options: [
        //                    { id: "new12", type: "button", img: "fa fa-file-o", text: "生产" },
        //                    { id: "new13", type: "button", img: "fa fa-file-o", text: "图档" },
        //                    { id: "new14", type: "button", img: "fa fa-file-o", text: "质量" },
        //                ]
        //            },
        //            { id: "new2", type: "button", img: "fa fa-file-o", text: "生产" },
        //            { id: "new3", type: "button", img: "fa fa-file-o", text: "图档" },
        //            { id: "new4", type: "button", img: "fa fa-file-o", text: "质量" },
        //            { id: "new5", type: "button", img: "fa fa-file-o", text: "绩效" },
        //            { id: "new6", type: "button", img: "fa fa-file-o", text: "综合办公" },
        //        ]
        //    },
        //    {
        //        id: "task", type: "buttonSelect", img: "open.gif", text: "生产任务", mode: "select", options: [
        //            { id: "task1", type: "button", img: "fa fa-file-o", text: "工程任务单", action: "modify" },
        //            { id: "task2", type: "button", img: "fa fa-file-o", text: "工程策划", action: "modify" },
        //            { id: "task3", type: "button", img: "fa fa-file-o", text: "<strong>专业策划</strong>", action: "modify" },
        //            { id: "task4", type: "button", img: "fa fa-file-o", text: "<span>设计</span>", action: "modify" },
        //            { id: "task5", type: "button", img: "fa fa-file-o", text: "校对", action: "modify" },
        //            { id: "task6", type: "button", img: "fa fa-file-o", text: "审核", action: "modify" },
        //            { id: "task7", type: "button", img: "fa fa-file-o", text: "批准", action: "modify" },
        //        ]
        //    },
        //    {
        //        id: "form", type: "buttonSelect", img: "open.gif", text: "表单", mode: "select", options: [
        //            { id: "form1", type: "button", img: "fa fa-file-o", text: "请假单", action: "modify" },
        //            { id: "form2", type: "button", img: "fa fa-file-o", text: "变更单", action: "modify" },
        //            { id: "form3", type: "button", img: "fa fa-file-o", text: "联系单", action: "modify" },
        //            { id: "form4", type: "button", img: "fa fa-file-o", text: "出版申请单", action: "modify" },
        //        ]
        //    },

        //    { type: "separator" },
        //    {
        //        id: "edit", type: "buttonSelect", img: "new.gif", text: "Select", mode: "select", selected: "edit_paste",
        //        options: [
        //            { type: "button", id: "edit_cut", text: "项目", img: "cut.gif" },
        //            { type: "button", id: "edit_copy", text: "工程", img: "copy.gif" },
        //            { type: "button", id: "edit_paste1", text: "合同", img: "paste.gif" },
        //            { type: "button", id: "edit_paste", text: "客户", img: "paste.gif" },
        //            { type: "button", id: "edit_paste2", text: "任务", img: "paste.gif" },
        //        ]
        //    },
        //    { id: "querytext", type: "buttonInput", width: 120 },
        //    { id: "query", type: "button", img: "page.gif", text: "查询", action: "query" }];

        $scope.news = [
            { id: 1, title: '1111111111', content: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', date: '2017/11/12', author: 'seth.tang' },
            { id: 1, title: '2222222222', content: 'xxxxxxxxxxxxxx', date: '2017/11/12', author: 'seth.tang' },
            { id: 1, title: '3333333333', content: 'xxxxxxxxxxxxxx', date: '2017/11/12', author: 'seth.tang' },
            { id: 1, title: '习近平主席视察王杰生前所在连侧记', content: 'xxxxxxxxxxxxxx', date: '2017/11/12', author: 'seth.tang' },
            { id: 1, title: '1111111111', content: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', date: '2017/11/12', author: 'seth.tang' },
            { id: 1, title: '1111111111', content: 'xxxxxxxxxxxxxx', date: '2017/11/12', author: 'seth.tang' },
            { id: 1, title: '1111111111', content: 'xxxxxxxxxxxxxx', date: '2017/11/12', author: 'seth.tang' },
            { id: 1, title: '1111111111', content: 'xxxxxxxxxxxxxx', date: '2017/11/12', author: 'seth.tang' },
            { id: 1, title: '1111111111', content: 'xxxxxxxxxxxxxx', date: '2017/11/12', author: 'seth.tang' },
            { id: 1, title: '1111111111', content: 'xxxxxxxxxxxxxx', date: '2017/11/12', author: 'seth.tang' },
        ];

        $scope.wins = [];

        $scope.page = {};

        $scope.openNews = function (news) {

            $scope.wins.push({
                config: {
                    height: 500,
                    width: 500,
                    text: '[新闻]' + news.title,
                },
                view: 'news/viewer.html',
                controller: 'news/viewerCtl',
                controllerUrl: 'news/viewer',
                resolve: {
                    "news": news
                }
            });

            //$scope.page = {
            //    view: 'news/viewer.html',
            //    controller: 'news/viewerCtl',
            //    controllerUrl: 'news/viewer',
            //    resolve: {
            //        "news": news
            //    }
            //}
        }

        myApi.getUsers().then(function (data) {
            var orgs = paraseTreeData(data);
            $scope.users = {
                "id": 0,
                "item": orgs
            };
        });

        var paraseTreeData = function (nodes) {
            var newNodes = [];
            angular.forEach(nodes, function (node) {
                var newNode = {
                    id: node.Key,
                    text: node.Name,
                };

                if (node.SubDepartments && node.SubDepartments.length > 0) {
                    newNode.open = 1;
                }

                newNode.item = paraseTreeData(node.SubDepartments);

                if (node.Users) {

                    angular.forEach(node.Users, function (user) {
                        newNode.item.push({
                            id: "u" + user.ID,
                            text: user.Account
                        });
                    })
                }

                newNodes.push(newNode);

            });
            return newNodes;
        }

        $scope.treeHandlers = [
            {
                type: "onClick",
                handler: function (id, a, b, c) {

                    if (id.indexOf('Origanization') < 0) {

                        $scope.wins.push({
                            config: {
                                height: 500,
                                width: 500,
                                text: '[聊天]',
                            },
                            view: 'chat/chat.html',
                            controller: 'chatController',
                            controllerUrl: 'chat/chat',
                            resolve: {
                                "userId": id
                            }
                        });

                      
                        $scope.$apply();
                    }
                }
            }
        ];

        $scope.toolbarItems = [
            {
                id: 'go', img: 'fa fa-file', text: "我的首页",
            },
            {
                id: 'favite', img: 'fa fa-heart', text: "关注工程"
            },
            {
                id: "new", img: "fa fa-plane", text: "快速访问", items: [
                    {
                        id: "new1", img: "fa fa-file", text: "经营",
                        items: [
                            { id: "new12", img: "fa fa-file", text: "工程管理" },
                            { id: "new13", img: "fa fa-file", text: "合同管理" },
                            { id: "new14", img: "fa fa-file", text: "任务单" },
                        ]
                    },
                    { id: "new2", img: "fa fa-file", text: "生产" },
                    { id: "new3", img: "fa fa-file", text: "图档" },
                    { id: "new4", img: "fa fa-file", text: "质量" },
                    { id: "new5", img: "fa fa-file", text: "绩效" },
                    { id: "new6", img: "fa fa-file", text: "综合办公" },
                ]
            },
            {
                id: "task", img: "fa fa-tasks", text: "生产任务", mode: "select", items: [
                    { id: "task1", img: "", text: "工程任务单", action: "modify" },
                    { id: "task2", img: "", text: "工程策划", action: "modify" },
                    { id: "task3", img: "fa fa-circle c-red", text: "专业策划", action: "modify" },
                    { id: "task4", img: "", text: "<span>设计</span>", action: "modify" },
                    { id: "task5", img: "fa fa-circle c-red", text: "校对", action: "modify" },
                    { id: "task6", img: "", text: "审核", action: "modify" },
                    { id: "task7", img: "fa fa-circle c-red", text: "批准", action: "modify" },
                ]
            },
            {
                id: "form", img: "fa fa-folder", text: "表单", mode: "select", items: [
                    { id: "form1", img: "fa fa-file-o", text: "请假单", action: "modify" },
                    { id: "form2", img: "fa fa-file-o", text: "变更单", action: "modify" },
                    { id: "form3", img: "fa fa-file-o", text: "联系单", action: "modify" },
                    { id: "form4", img: "fa fa-file-o", text: "出版申请单", action: "modify" },
                ]
            },
            {
                id: 'hideRight', img: 'fa fa-close', text: "关闭右侧"
            }, ];

        $scope.go = function (id) {
            $page.go({
                id: id,
                text: "菜单页面",
                ViewUrl: 'system/page/page',
                ControllerUrl: 'system/page/page',
                Controller: 'pageController'
            });
        }

        $scope.menuAction = function (id, item) {
            $scope[id]();
        }

        $scope.hideRight = function () {
            var cell = $scope.layout.cells("b");
            //collapse expand dock undock
            if (cell.isCollapsed()) {
                cell.expand();
            } else {
                cell.collapse();
            }
        }

        $scope.loaded = function (layout) {
            $scope.layout = layout;
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