/**
 * Created by liuhuisheng on 2015/2/28.
 */
define(['app'], function (app) {
    app.directive('dhtmlxgrid', function ($resource, $compile) {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                fields: '@',
                header1: '@',
                header2: '@',
                colwidth: '@',
                colalign: '@',
                coltype: '@',
                colsorting: '@',
                pagingsetting: '@',
                autoheight: '=',
                url: '@',
                params: '@',
                contextmenus: '@',
                contextaction:'&'
            },
            link: function (scope, element, attrs) {
                scope.uid = app.genStr(12);
                element.attr("id", "dhx_grid_" + scope.uid);
                element.css({ "width": "100%", "border-width": "1px 0 0 0" });
                var imgPath = app.getProjectRoot("assets/lib/dhtmlx/v403_pro/skins/skyblue/imgs/");

                scope.grid = new dhtmlXGridObject(element[0]);
                scope.header1 && scope.grid.setHeader(scope.header1);
                scope.header2 && scope.grid.attachHeader(scope.header2);
                scope.fields && scope.grid.setFields(scope.fields);
                scope.colwidth && scope.grid.setInitWidths(scope.colwidth)
                scope.colalign && scope.grid.setColAlign(scope.colalign)
                scope.coltype && scope.grid.setColTypes(scope.coltype);
                scope.colsorting && scope.grid.setColSorting(scope.colsorting);
               
                if (scope.contextmenus != null && scope.contextmenus != undefined) {
                    var menu = eval("(" + scope.contextmenus + ")");
                    if (menu.length > 0) {
                        var onButtonClick = function (menuId) {
                            var rowId = scope.grid.contextID.split("_")[0]; //rowId_colInd
                            scope.contextaction({ menuId: menuId, rowId: rowId });
                        }
                        var myMenu = new dhtmlXMenuObject();
                        myMenu.setIconsPath("assets/img/btn");
                        myMenu.renderAsContextMenu();
                        myMenu.attachEvent("onClick", onButtonClick);

                        myMenu.loadStruct(menu);

                        scope.grid.enableContextMenu(myMenu);
                    }
                }

                scope.grid.entBox.onselectstart = function () { return true; };

                if (scope.pagingsetting) {
                    var pagingArr = scope.pagingsetting.split(",");
                    var pageSize = parseInt(pagingArr[0]);
                    var pagesInGrp = parseInt(pagingArr[1]);
                    var pagingArea = document.createElement("div");
                    pagingArea.id = "pagingArea_" + scope.uid;
                    pagingArea.style.borderWidth = "1px 0 0 0";
                    var recinfoArea = document.createElement("div");
                    recinfoArea.id = "recinfoArea_" + scope.uid;
                    element.after(pagingArea);
                    element.after(recinfoArea);
                    scope.grid.enablePaging(true, pageSize, pagesInGrp, pagingArea.id, true, recinfoArea.id);
                    scope.grid.setPagingSkin("toolbar", "dhx_skyblue");
                    scope.grid.i18n.paging = {
                        results: "结果",
                        records: "显示",
                        to: "-",
                        page: "页",
                        perpage: "行每页",
                        first: "首页",
                        previous: "上一页",
                        found: "找到数据",
                        next: "下一页",
                        last: "末页",
                        of: " 的 ",
                        notfound: "查询无数据"
                    };
                }

                scope.grid.setImagePath(imgPath);
                scope.grid.init();

                if (scope.autoheight) {
                    var resizeGrid = function () {
                        element.height(element.parent().parent().height() - scope.autoheight);
                        scope.grid.setSizes();
                    };
                    $(window).resize(resizeGrid);
                    resizeGrid();
                }

                //scope.grid.enableSmartRendering(true);

                if (scope.url) {
                    var url = app.getApiUrl(scope.url);
                    var param = scope.$parent[scope.params] || {};

                    var api = $resource(url, {}, { query: { method: 'GET', isArray: false } });

                    scope.grid.setQuery(api.query, param);
                }

                //保存grid到父作用域中
                attrs.dhtmlxgrid && (scope.$parent[attrs.dhtmlxgrid] = scope.grid);
            }
        };
    });

    app.directive('dhtmlxtoolbar', function () {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                iconspath: '@',
                items: '@'
            },
            link: function (scope, element, attrs) {
                scope.uid = app.genStr(12);
                element.attr("id", "dhx_toolbar_" + scope.uid);
                //element.css({ "border-width": "0 0 1px 0px" });


                scope.toolbar = new dhtmlXToolbarObject(element[0]);
                scope.toolbar.setIconsPath(app.getProjectRoot(scope.iconspath));
                var items = eval("(" + scope.items + ")");
                //scope.toolbar.loadStruct(items);

                var index = 1;
                var eventmap = {};
                for (var i in items) {
                    var item = items[i];
                    if (item.action)
                        eventmap[item.id] = item.action;

                    if (item.type == 'button') {
                        scope.toolbar.addButton(item.id, index++, item.text, item.img, item.imgdis);
                        item.enabled == false && scope.toolbar.disableItem(item.id);
                    }
                    else if (item.type == 'separator') {
                        scope.toolbar.addSeparator(index++);
                    }
                }

                scope.toolbar.attachEvent("onClick", function (id) {
                    var name = eventmap[id];
                    if (name && scope.$parent[name] && angular.isFunction(scope.$parent[name]))
                        scope.$parent[name].call(this);
                });

                //保存grid到父作用域中
                attrs.dhtmlxtoolbar && (scope.$parent[attrs.dhtmlxtoolbar] = scope.toolbar);

                //scope.toolbar.addButton("new", 1, "新增", "add.png");
                //scope.toolbar.addButton("edit", 2, "修改", "edit.gif");
                //scope.toolbar.addButton("del", 3, "删除", "cross.png");
                //scope.toolbar.addButton("test2", 5, "测试", "fa fa-comments", "green");
                //scope.toolbar.disableItem("edit");
                //scope.toolbar.attachEvent("onClick", function (id) {
                //    alert(id);
                //});
            }
        }
    });

    app.directive('dhtmlxlayout', function () {
        return {
            restrict: 'A',
            transclude:true,
            replace: false,
            link: function (scope, element, attrs) {
                //  - 31
                var resizeLayout = function () {
                    element.height(element.parent().parent().height());
                };
                $(window).resize(resizeLayout);
                resizeLayout();
                
                //var cellCount = parseInt(attrs.pattern.substring(0, 1));

                //var cellObj = element[0];
                //var cellObjs = [];
                //debugger;
                //for (var i = 0; i < cellCount; i++) {
                //    cellObj = cellObj.nextElementSibling;
                //    cellObjs.push(cellObj);
                //}
              
                myLayout = new dhtmlXLayoutObject(element[0], attrs.pattern);
              
                //var cellNames = ["a", "b", "c", "d", "e", "f", "g"];
                //for (var i = 0; i < cellCount; i++) {

                //    var cell = myLayout.cells(cellNames[i]);
                //    cell.attachObject(cellObjs[i]);

                //    var $cell = $(cellObjs[i]);

                //    cell.setText($cell.data("head"));

                //    if ($cell.attr("hidehead")) {
                //        cell.hideHeader();
                //    }
                //    if ($cell.data("width")) {
                //        cell.setWidth($cell.data("width"));
                //    }
                    
                //}
                
            }
        }
    });

    app.directive('dhtmlxtree', function () {
        return {
            restrict: 'A',
            replace: false,
            link: function (scope, element, attrs) {
                var items = [
                    {
                        id: 1, text: "美和信息技术有限公司", open: 1, item: [
                        // nested items if any
                         { id: "1.1", text: "办公室1", checked: true },
                         { id: "1.2", text: "办公室2", checked: true },
                    ]},
 
                    // checkboxes mode
                    {id: "2", text: "Text 2", checked: true},
                    {id: "3", text: "Text 3", checked: true, checkbox: "disabled"},
                    {id: "4", text: "Text 4", checkbox: "disabled"},
                    {id: "5", text: "Text 5", checkbox: "hidden"},
 
                    // custom icons
                    {id: "6", text: "Text 6", icons: {
                        file: "icon_file",
                        folder_opened: "icon_opened",
                        folder_closed: "icon_closed"
                    }},
 
                    // userdata
                    {id: "7", text: "Text 7", userdata: {
                        name1: "value1", name2: "value2"
                    }}
                ]
                var treeImgPath = app.getSkinImgPath("dhxtree");

                myTree = new dhtmlXTreeObject(element[0], "100%", "100%", 0);
                myTree.setImagePath(treeImgPath);
                myTree.loadJSONObject({ id: 0, item: items });
              
                //myTreeView.attachEvent("onClick", self.onTreeClick);
            }
        }
    });

    app.factory('DhxUtils', [function () {
        var _imgPath = "bower_components/dhtmlx/imgs/";

        /**
         * @param dhxObject
         * @param dhxHandlers
         */
        var attachDhxHandlers = function (dhxObject, dhxHandlers) {
            (dhxHandlers || [])
              .forEach(function (info) {
                  dhxObject.attachEvent(info.type, info.handler);
              });
        };

        var getImagePath = function () {
            return _imgPath;
        };

        var setImagePath = function (imgPath) {
            _imgPath = imgPath;
        };

        /**
         * I hope to never resort to using that
         */
        var createCounter = function () {
            var current = -1;
            return function () {
                current++;
                return current;
            };
        };

        var removeUndefinedProps = function(obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop) && obj[prop] === undefined) {
                    delete obj[prop];
                }
            }
        };

        var dhxDestroy = function (dhxObj) {
            var destructorName =
              'destructor' in dhxObj
                ? 'destructor'
                :
                ('unload' in dhxObj
                  ? 'unload'
                  : null);

            if (destructorName === null) {
                console.error('Dhtmlx object does not have a destructor or unload method! Failed to register with scope destructor!');
                return;
            }

            dhxObj[destructorName]();
        };


        var dhxUnloadOnScopeDestroy = function (scope, dhxObj) {
            var destructorName =
              'destructor' in dhxObj
                ? 'destructor'
                :
                ('unload' in dhxObj
                  ? 'unload'
                  : null);
            if (destructorName === null) {
                console.error('Dhtmlx object does not have a destructor or unload method! Failed to register with scope destructor!');
                return;
            }

            scope.$on(
              "$destroy",
              function (/*event*/) {
                  dhxObj[destructorName]();
              }
            );
        };

        return {
            attachDhxHandlers: attachDhxHandlers,
            getImagePath: getImagePath,
            setImagePath: setImagePath,
            createCounter: createCounter,
            removeUndefinedProps: removeUndefinedProps,
            dhxUnloadOnScopeDestroy: dhxUnloadOnScopeDestroy,
            dhxDestroy: dhxDestroy
        };
    }]);

    app.directive('dhxLayout', function factory(DhxUtils) {
        var letters = "abcdefg";
        return {
            restrict: 'E',
            require: 'dhxLayout',
            controller: function ($scope) {
                $scope.panes = [];
                this.getNextId = (function () {
                    var letters = "abcdefg";
                    var current = -1;
                    return function () {
                        current++;
                        return current < 7 ? letters[current] : console.error('Too many dhxLayout panes.');
                    };
                })();
                this.registerPane = function (pane) {
                    $scope.panes.push(pane);
                };
            },
            scope: {
                dhxLayoutCode: "@",
                dhxWidth: "=", // Optional... Default is 100%. If set, use ems or pixels.
                dhxHeight: "=", // Mandatory.
                dhxUseEms: "=", // Optional... If width and height is in ems. Px is   default;
                dhxHandlers: '=',
                dhxObj: '=',
                dhxWhenDone: '='
            },
            link: function (scope, element, attrs, layoutCtrl) {
                $(element).empty();
                $('<div></div>').appendTo(element[0]);
                var rootElem = element.children().first();

                var dim = (scope.dhxUseEms ? 'em' : 'px');
                //TODO: Come up with a way to do 100% height (Within current container)
                var height = scope.dhxHeight ? (scope.dhxHeight + dim) : '100%';//console.warn('Please set dhx-layout height!');
                var width = scope.dhxWidth ? (scope.dhxWidth + dim) : '100%';

                rootElem.css('width', width);
                rootElem.css('height', height);
                rootElem.css('padding', '0px');
                rootElem.css('margin', '0px');
                rootElem.css('overflow', 'hidden');
                rootElem.css('display', 'block');

                //noinspection JSPotentiallyInvalidConstructorUsage
                rootElem[0]._isParentCell = true;
                var layout = new dhtmlXLayoutObject({
                    parent: rootElem[0],
                    pattern: scope.dhxLayoutCode,
                    //offsets: { //TODO: Add them as optionals
                    //  top: 10,
                    //  right: 10,
                    //  bottom: 10,
                    //  left: 10
                    //},
                    cells: scope
                      .panes
                      .map(function (paneObj) {
                          paneObj.cellConfig.id = layoutCtrl.getNextId();
                          return paneObj.cellConfig;
                      })
                }
                );
                if (scope.dhxObj)
                    scope.dhxObj = layout;
                layout.setSizes();

                for (var i = 0; i < scope.panes.length; i++) {
                    var dom = scope.panes[i].jqElem[0];
                    if (dom != null) {
                        layout.cells(letters[i]).appendObject(dom);
                    }

                }
                DhxUtils.attachDhxHandlers(layout, scope.dhxHandlers);
                DhxUtils.dhxUnloadOnScopeDestroy(scope, layout);
                if (scope.dhxWhenDone) {
                    scope.dhxWhenDone(layout);
                }
            }
        };
    });

    app.directive('dhxLayoutPane', function factory() {
    return {
        restrict: 'E',
        require: '^dhxLayout',
        scope: {
            dhxText: '@',
            dhxCollapsedText: '@', // If this is omitted it becomes dhxText
            dhxHeader: '=', // Expression... since it is a boolean value
            dhxWidth: '@',  // These are optional... However when specified they
            dhxHeight: '@', // should not conflict with the layout width and height
            dhxCollapse: '=', // Expression... since it is a boolean value
            dhxFixSize: '='
        },
        link: function (scope, element, attrs, layoutCtrl) {


            layoutCtrl.registerPane({
                jqElem: element.detach(),
                cellConfig: {
                    text: scope.dhxText || "",
                    collapsed_text: scope.dhxCollapsedText || scope.dhxText || "",
                    header: scope.dhxHeader,
                    width: scope.dhxWidth,
                    height: scope.dhxHeight,
                    collapse: scope.dhxCollapse == undefined ? false : scope.dhxCollapse,
                    fix_size: scope.dhxFixSize
                }
            });
        }
    };
});

});