define(['app', 'config'], function (app, config) {
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
                contextaction: '&'
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
            transclude: true,
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
                //
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
                        ]
                    },

                    // checkboxes mode
                    { id: "2", text: "Text 2", checked: true },
                    { id: "3", text: "Text 3", checked: true, checkbox: "disabled" },
                    { id: "4", text: "Text 4", checkbox: "disabled" },
                    { id: "5", text: "Text 5", checkbox: "hidden" },

                    // custom icons
                    {
                        id: "6", text: "Text 6", icons: {
                            file: "icon_file",
                            folder_opened: "icon_opened",
                            folder_closed: "icon_closed"
                        }
                    },

                    // userdata
                    {
                        id: "7", text: "Text 7", userdata: {
                            name1: "value1", name2: "value2"
                        }
                    }
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
        //var _imgPath = "bower_components/dhtmlx/imgs/";
        var _imgPath = app.getProjectRoot("assets/lib/dhtmlx/v403_pro/skins/skyblue/imgs/");

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

        var removeUndefinedProps = function (obj) {
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

    app.directive('dhxGrid', function factory(DhxUtils, $resource) {
        return {
            restrict: 'E',
            require: ['?^^dhxLayoutCell'],
            scope: {
                /**
                 * Grid will be accessible in controller via this scope entry
                 * after it's initialized.
                 * NOTE: For better design and testability you should use instead the
                 * configure and dataLoaded callbacks.
                 */
                dhxObj: '=',
                /** Mandatory in current implementation! */
                dhxMaxHeight: '=',
                /** Optional. Default is 100%. */
                dhxMaxWidth: '=',
                /**
                 * Data is given here as an object. Not a filename! Must conform to the
                 * specified or default dataFormat
                 */
                dhxData: '=',
                /**
                * auto query data from server by this url
                */
                dhxUrl: '@',
                /**
                * if use url to load data use this params
                */
                dhxParams: '=',
                /**
                 * View possible formats here: http://docs.dhtmlx.com/grid__data_formats.html
                 * Currently supported:
                 * ['Basic JSON', 'Native JSON'] // 'Basic JSON' is default value
                 */
                dhxDataFormat: '=',
                /** Optional! Recommended! http://docs.dhtmlx.com/api__dhtmlxgrid_setheader.html */
                dhxHeader: '=',
                dhxFields: '@',
                /** Optional! http://docs.dhtmlx.com/api__dhtmlxgrid_setcoltypes.html */
                dhxColTypes: '=',
                /** Optional! http://docs.dhtmlx.com/api__dhtmlxgrid_setcolsorting.html */
                dhxColSorting: '=',
                /** Optional! http://docs.dhtmlx.com/api__dhtmlxgrid_setcolalign.html */
                dhxColAlign: '=',
                /** Optional! http://docs.dhtmlx.com/api__dhtmlxgrid_setinitwidthsp.html */
                dhxInitWidths: '=',
                /** Optional! http://docs.dhtmlx.com/api__dhtmlxgrid_setinitwidths.html */
                dhxInitWidthsP: '=',
                /**
                 * preLoad and postLoad callbacks to controller for additional
                 * customization power.
                 */
                dhxConfigureFunc: '=',
                dhxOnDataLoaded: '=',
                /**
                 * [{type: <handlerType>, handler: <handlerFunc>}]
                 * where type is 'onSomeEvent'
                 * Events can be seen at: http://docs.dhtmlx.com/api__refs__dhtmlxgrid_events.html
                 * Optional
                 */
                dhxHandlers: '=',
                dhxVersionId: '=',

                dhxContextMenu: '=',
                dhxAutoHeight: '@',
                dhxPaging: '='
            },
            link: function (scope, element, attrs, ctls) {

                scope.uid = app.genStr(12);

                var createGrid = function () {
                    $(element).empty();
                    $('<div></div>').appendTo(element[0]);
                    var rootElem = element.children().first();

                    var width = scope.dhxMaxWidth ? (scope.dhxMaxWidth + 'px') : '100%';
                    var height = scope.dhxMaxHeight ? (scope.dhxMaxHeight + 'px') : '100%';

                    //noinspection JSPotentiallyInvalidConstructorUsage
                    if (scope.dhxObj) {
                        DhxUtils.dhxDestroy(scope.dhxObj);
                    }

                    if (scope.dhxAutoHeight) {
                        height = element.parent().parent().height() - scope.dhxAutoHeight + 'px';
                    }

                    rootElem.css('width', width);
                    rootElem.css('height', height);

                    grid = scope.dhxObj = new dhtmlXGridObject(rootElem[0]);

                    if (scope.dhxAutoHeight) {
                        height = element.parent().parent().height() - scope.dhxAutoHeight + 'px';
                    }

                    return grid;
                }

                var setGrid = function (grid, cell) {
                    scope.dhxObj = grid;

                    grid.setImagePath(DhxUtils.getImagePath());
                    grid.enableAutoHeight(!!scope.dhxMaxHeight, scope.dhxMaxHeight, true);
                    grid.enableAutoWidth(!!scope.dhxMaxWidth, scope.dhxMaxWidth, true);
                    scope.dhxHeader ? grid.setHeader(scope.dhxHeader) : '';
                    scope.dhxColTypes ? grid.setColTypes(scope.dhxColTypes) : '';
                    scope.dhxColSorting ? grid.setColSorting(scope.dhxColSorting) : '';
                    scope.dhxColAlign ? grid.setColAlign(scope.dhxColAlign) : '';
                    scope.dhxInitWidths ? grid.setInitWidths(scope.dhxInitWidths) : '';
                    scope.dhxInitWidthsP ? grid.setInitWidthsP(scope.dhxInitWidthsP) : '';
                    scope.dhxFields && grid.setFields(scope.dhxFields);

                    scope.dhxContextMenu ? grid.enableContextMenu(scope.dhxContextMenu) : '';
                    scope.$watch(
                      "dhxContextMenu",
                      function handle(newValue, oldValue) {
                          grid.enableContextMenu(newValue);
                      }
                    );

                    // Letting controller add configurations before data is parsed
                    if (scope.dhxConfigureFunc) {
                        scope.dhxConfigureFunc(grid);
                    }
                    grid.init();
                    if (scope.dhxPaging) {

                        var pageSize = 20;
                        var pagesInGrp = 5;
                        var pageAreaId = "pagingArea_" + scope.uid;
                        var recinfoAreaId = "recinfoArea_" + scope.uid;
                        if (cell) {
                            cell.attachStatusBar({
                                text: "<div id='" + pageAreaId + "'></div><div id='" + recinfoAreaId + "'></div>",
                                height: 30,
                                paging: true
                            });
                            grid.enablePaging(true, pageSize, pagesInGrp, pageAreaId, true, recinfoAreaId);
                        } else {
                            var pagingArea = document.createElement("div");
                            pagingArea.id = pageAreaId;
                            pagingArea.style.borderWidth = "1px 0 0 0";
                            var recinfoArea = document.createElement("div");
                            recinfoArea.id = recinfoAreaId;
                            element.after(pagingArea);
                            element.after(recinfoArea);
                            grid.enablePaging(true, pageSize, pagesInGrp, pageAreaId, true, recinfoAreaId);
                        }
                        grid.setPagingSkin("toolbar", "dhx_skyblue");
                        grid.i18n.paging = {
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


                    if (scope.dhxAutoHeight) {

                        var resizeGrid = function () {

                            rootElem.css('height', element.parent().parent().height() - scope.dhxAutoHeight + 'px');
                            //rootElem.height();
                            grid.setSizes();

                            //element.height(element.parent().parent().height() - scope.autoheight);
                            //grid.setSizes();
                        };
                        $(window).resize(resizeGrid);
                        resizeGrid();
                    }


                    var myDataProcessor = new dataProcessor(config.webapi);
                    myDataProcessor.init(grid); // link dataprocessor to the grid
                    myDataProcessor.setTransactionMode("REST", false);
                   
                    // Finally parsing data
                    scope.$watch("dhxData", function (newval, oldval) {
                        
                        if (newval) {
                            
                            var dhxDataFormat = scope.dhxDataFormat || 'Basic JSON';
                            switch (dhxDataFormat) {
                                case 'Basic JSON':
                                    grid.clearAll();
                                    grid.parse(scope.dhxData, 'json');
                                    //grid.callEvent("onXLE", [grid, 0, 0, scope.dhxData]);

                                    break;
                                case 'Native JSON':
                                    grid.load(scope.dhxData, 'js');
                                    break;
                            }
                        }
                    });

                    if (scope.dhxData !== null && scope.dhxData !== undefined) {
                        //var dhxDataFormat = scope.dhxDataFormat || 'Basic JSON';
                        //switch (dhxDataFormat) {
                        //    case 'Basic JSON':
                        //        grid.parse(scope.dhxData, 'json');
                        //        break;
                        //    case 'Native JSON':
                        //        grid.load(scope.dhxData, 'js');
                        //        break;
                        //}
                    } else if (scope.dhxUrl) {
                        var url = app.getApiUrl(scope.dhxUrl);
                        var param = scope.dhxParams || {};

                        var api = $resource(url, {}, { query: { method: 'GET', isArray: false } });

                        grid.setQuery(api.query, param);
                    }

                    // Letting controller do data manipulation after data has been loaded
                    if (scope.dhxOnDataLoaded) {
                        scope.dhxOnDataLoaded(grid);
                    }

                    DhxUtils.attachDhxHandlers(grid, scope.dhxHandlers);
                    DhxUtils.dhxUnloadOnScopeDestroy(scope, grid);
                };

                if (ctls[0] != null) {
                    ctls[0].addCreator(function (layout, cell) {
                        var grid = cell.attachGrid();
                        setGrid(grid, cell);
                    });
                } else {
                    scope.$watch('dhxVersionId', function (/*newVal, oldVal*/) {
                        var grid = createGrid();

                        setGrid(grid);
                    });
                }
            }
        };
    });

    app.directive('dhxLayout', function factory(DhxUtils) {
        var letters = "abcdefg";
        return {
            restrict: 'E',
            require: ['dhxLayout', '?^^dhxWindow'],
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
                this.attachGrid = function () {

                }
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
            link: function (scope, element, attrs, ctrls) {
                var layoutCtrl = ctrls[0];
                var windowCtrl = ctrls[1];
                
                var setCell = function (layout) {

                    for (var i = 0; i < scope.panes.length; i++) {
                        var cell = layout.cells(letters[i]);
                        // 如果cell中没有可以attach的对象则直接attachdom
                        if (!scope.panes[i].attach(layout, cell)) {
                            var dom = scope.panes[i].jqElem[0];
                            if (dom != null) {
                                cell.appendObject(dom);
                            }
                        }

                        if (scope.panes[i].status) {
                            cell.attachStatusBar({
                                text: scope.panes[i].status,
                                height: 30
                            });
                        }
                        if (scope.panes[i].hideHeader) {
                            cell.hideHeader();
                        }
                    }

                    DhxUtils.attachDhxHandlers(layout, scope.dhxHandlers);
                    DhxUtils.dhxUnloadOnScopeDestroy(scope, layout);
                    if (scope.dhxWhenDone) {
                        scope.dhxWhenDone(layout);
                    }
                }
                
                if (windowCtrl == null) {
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
                    });
                    if (scope.dhxObj)
                        scope.dhxObj = layout;

                    setCell(layout);
                    layout.setSizes();
                } else if (windowCtrl != null) {
                    windowCtrl.registerLayoutCallbak(function (win) {
                        var layout = win.attachLayout({
                            pattern: scope.dhxLayoutCode,
                            cells: scope
                              .panes
                              .map(function (paneObj) {
                                  paneObj.cellConfig.id = layoutCtrl.getNextId();
                                  return paneObj.cellConfig;
                              })
                        });

                        setCell(layout);
                    });
                }
            }
        };
    });

    app.directive('dhxLayoutCell', function factory() {
        return {
            restrict: 'E',
            require: '^dhxLayout',
            scope: {
                dhxText: '@',
                dhxStatus: '=',
                dhxHideHeader:'@',
                dhxCollapsedText: '@', // If this is omitted it becomes dhxText
                dhxHeader: '=', // Expression... since it is a boolean value
                dhxWidth: '@',  // These are optional... However when specified they
                dhxHeight: '@', // should not conflict with the layout width and height
                dhxCollapse: '=', // Expression... since it is a boolean value
                dhxFixSize: '='
            },
            controller: function ($scope) {
                $scope.creators = [];
                $scope.attach = function (layout, cell) {

                    angular.forEach($scope.creators, function (creator) {
                        creator(layout, cell);
                    });

                    return $scope.creators.length > 0;
                }
                this.addCreator = function (creator) {
                    $scope.creators.push(creator);
                }
            },
            link: function (scope, element, attrs, layoutCtrl) {

                layoutCtrl.registerPane({
                    jqElem: element.detach(),
                    attach: scope.attach,
                    status: scope.dhxStatus,
                    hideHeader:scope.dhxHideHeader,
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

    app.directive('dhxToolbar', function factory(DhxUtils) {
        return {
            restrict: 'E',
            require: ['?^^dhxLayoutCell'],
            template: '<div></div>',
            replace: true,
            controller: function () {
            },
            scope: {
                dhxItems: '='
            },
            link: function (scope, element, attrs, ctrls) {
                var layoutCtl = ctrls[0];
                
                var eventmap = {};
                scope.dhxItems.map(function (item) {
                    if (item.action) {
                        eventmap[item.id] = item.action
                    }
                   
                    if (item.type == "buttonSelect") {
                        item.options.map(function (option) {
                            if (option.action) {
                                eventmap[option.id] = option.action
                            }
                        });
                    }
                });

                var setToolbar = function (toolbar) {
                    toolbar.setIconsPath(app.getProjectRoot("assets/img/btn/"));
                    toolbar.loadStruct(scope.dhxItems);
                    toolbar.attachEvent("onClick", function (id) {
                        
                        var name = eventmap[id];
                        if (name && scope.$parent[name] && angular.isFunction(scope.$parent[name]))
                            scope.$parent[name].call(this);
                    });
                }

                if (layoutCtl == null || layoutCtl == undefined) {
                    scope.uid = app.genStr(12);
                    element.attr("id", "dhx_toolbar_" + scope.uid);
                    //element.css({ "border-width": "0 0 1px 0px" });

                    var toolbar = new dhtmlXToolbarObject(element[0]);
                    setToolbar(toolbar);

                } else {
                    layoutCtl.addCreator(function (layout, cell) {
                        var toolbar = cell.attachToolbar();
                        setToolbar(toolbar);
                    })
                }
            }
        };
    });

    app.directive('dhxMenu', function factory(DhxUtils) {
        return {
            restrict: 'E',
            require: 'dhxMenu',
            controller: function () {
            },
            scope: {
                dhxMenu: '=',
                dhxHandlers: '=',
                dhxOnClick: '=',
                dhxOnLoadedAndRendered: '=',
                /**
                 * if (loadFromHtml)
                 *  LoadFromHtml_fromDomChildren(),
                 * else if (loadXMLFromDom)
                 *  loadStruct(xmlFromChildren)
                 * else
                 *  loadStruct(XmlJsonData)
                 **/
                dhxLoadFromHtml: '=',
                dhxLoadXmlFromDom: '=',
                dhxXmlJsonData: '=',

                dhxContextMenuMode: '=',
                dhxContextZones: '=',
                dhxContextAsParent: '='
            },
            link: function (scope, element/*, attrs, menuCtrl*/) {
                //noinspection JSPotentiallyInvalidConstructorUsage

                var domChild = $(element).children().first().detach();

                var menu = new dhtmlXMenuObject(scope.dhxContextMenuMode ? undefined : element[0]);
                scope.dhxMenu ? scope.dhxMenu = menu : '';

                scope.dhxContextMenuMode ? menu.renderAsContextMenu() : undefined;

                if (scope.dhxContextZones) {
                    scope.dhxContextZones.forEach(function (zone) {
                        menu.addContextZone(zone);
                    });
                }

                if (scope.dhxContextAsParent) {
                    menu.addContextZone($(element).parent()[0]);
                }

                if (scope.dhxOnClick) {
                    DhxUtils.attachDhxHandlers(menu, [
                      {
                          type: 'onClick',
                          handler: scope.dhxOnClick
                      }
                    ]);
                }
                if (scope.dhxLoadFromHtml) {
                    menu.loadFromHTML(domChild[0], false, scope.dhxOnLoadedAndRendered);
                } else if (scope.dhxLoadXmlFromDom) {
                    menu.loadStruct(domChild[0].outerHTML, scope.dhxOnLoadedAndRendered);
                } else if (scope.dhxXmlJsonData) {
                    menu.loadStruct(scope.dhxXmlJsonData);
                } else {
                    console.error('Please specify one of dhx-load-from-html or dhx-load-from-dom or dhx-xml-json-data');
                }

                DhxUtils.attachDhxHandlers(menu, scope.dhxHandlers);
                DhxUtils.dhxUnloadOnScopeDestroy(scope, menu);
            }
        };
    });

    app.directive('dhxTree', function factory(DhxUtils) {
        return {
            restrict: 'E',
            require: ['dhxTree', '?^^dhxLayoutCell'],
            controller: function () {
            },
            scope: {
                /**
                 * Tree will be accessible in controller via this scope entry
                 * after it's initialized
                 */
                dhxTree: '=',
                /**
                 * Please refer to the following link for format:
                 * http://docs.dhtmlx.com/tree__syntax_templates.html#jsonformattemplate
                 */
                dhxJsonData: '=',
                /**
                 * [{type: <handlerType>, handler: <handlerFunc>}]
                 * where type is 'onSomeEvent'
                 * Events can be seen at: http://docs.dhtmlx.com/api__refs__dhtmlxtree_events.html
                 * Optional
                 */
                dhxHandlers: '=',
                /**
                 * Not an exhaustive list of enablers... feel free to add more.
                 * Optionals!
                 */
                dhxEnableCheckBoxes: '=',
                dhxEnableDragAndDrop: '=',
                dhxEnableHighlighting: '=',
                dhxEnableThreeStateCheckboxes: '=',
                dhxEnableTreeLines: '=',
                dhxEnableTreeImages: '=',
                /**
                 * preLoad and postLoad callbacks to controller for additional
                 * customization power.
                 */
                dhxConfigureFunc: '=',
                dhxOnDataLoaded: '=',

                dhxContextMenu: '='
            },
            link: function (scope, element, attrs, ctls) {

                var setTree = function (tree) {

                    scope.dhxTree = tree;

                    tree.setImagePath(DhxUtils.getImagePath() + 'dhxtree_skyblue/');

                    scope.dhxContextMenu ? tree.enableContextMenu(scope.dhxContextMenu) : '';
                    scope.$watch(
                      "dhxContextMenu",
                      function handle(newValue) {
                          tree.enableContextMenu(newValue);
                      }
                    );

                    // Additional optional configuration
                    tree.enableCheckBoxes(scope.dhxEnableCheckBoxes);

                    tree.enableDragAndDrop(scope.dhxEnableDragAndDrop);
                    tree.enableHighlighting(scope.dhxEnableHighlighting);
                    tree.enableThreeStateCheckboxes(scope.dhxEnableThreeStateCheckboxes);
                    tree.enableTreeImages(scope.dhxEnableTreeImages);
                    tree.enableTreeLines(scope.dhxEnableTreeLines);
                    // Letting controller add configurations before data is parsed


                    if (scope.dhxConfigureFunc) {
                        scope.dhxConfigureFunc(tree);
                    }
                    // Finally parsing data
                    //tree.parse(scope.dhxJsonData, "json");
                    scope.$watch("dhxJsonData", function (newval, oldval) {
                        if (newval) {
                            tree.loadJSONObject(scope.dhxJsonData);
                        }
                    });

                    // Letting controller do data manipulation after data has been loaded

                    if (scope.dhxOnDataLoaded) {
                        scope.dhxOnDataLoaded(tree);
                    }
                    DhxUtils.attachDhxHandlers(tree, scope.dhxHandlers);
                    DhxUtils.dhxUnloadOnScopeDestroy(scope, tree);
                }

                if (ctls[1] != null) {
                    ctls[1].addCreator(function (layout, cell) {
                        var tree = cell.attachTree();
                        setTree(tree);
                    });
                } else {
                    var tree = new dhtmlXTreeObject({
                        parent: element[0],
                        skin: "dhx_skyblue",
                        checkbox: true,
                    });
                    setTree(tree);
                }
            }
        };
    });

    app.directive('dhxWindows', function factory(DhxUtils) {
        var nextWindowsId = DhxUtils.createCounter();
        return {
            restrict: 'E',
            require: 'dhxWindows',
            controller: function (/*$scope*/) {
                var _windowInfos = [];
                var _container = document.documentElement;

                var _winsId = nextWindowsId();
                var _idPerWin = DhxUtils.createCounter();

                this.getNextWindowId = function () {
                    return "wins_" + _winsId + "_" + _idPerWin();
                };

                this.registerWindow = function (windowInfo) {
                    _windowInfos.push(windowInfo);
                };

                this.setContainer = function (container) {
                    _container = container;
                };

                this.getContainer = function () {
                    return _container;
                };

                this.getWindowInfos = function () {
                    return _windowInfos;
                }
            },
            scope: {
                dhxHandlers: '='
            },
            link: function (scope, element, attrs, windowsCtrl) {
                //noinspection JSPotentiallyInvalidConstructorUsage
                var windows = new dhtmlXWindows();
                windows.attachViewportTo(windowsCtrl.getContainer());
                windowsCtrl
                  .getWindowInfos()
                  .forEach(function (windowInfo) {
                      var conf = windowInfo.config;
                      DhxUtils.removeUndefinedProps(conf);
                      var win = windows.createWindow(
                        windowsCtrl.getNextWindowId(),
                        conf.left,
                        conf.top,
                        conf.width,
                        conf.height
                      );

                      conf.header != undefined ? (!conf.header ? win.hideHeader() : '') : '';
                      conf.center !== undefined ? (conf.center ? win.center() : '') : '';
                      conf.keep_in_viewport !== undefined ? win.keepInViewport(!!conf.keep_in_viewport) : '';
                      conf.showInnerScroll !== undefined ? (conf.showInnerScroll ? win.showInnerScroll() : '') : '';
                      conf.move !== undefined ? win[(conf.move ? 'allow' : 'deny') + 'Move']() : '';
                      conf.park !== undefined ? win[(conf.park ? 'allow' : 'deny') + 'Park']() : '';
                      conf.resize !== undefined ? win[(conf.resize ? 'allow' : 'deny') + 'Resize']() : '';
                      conf.text !== undefined ? win.setText(conf.text) : '';

                      conf.btnClose !== undefined ? win.button('close')[conf.btnClose ? 'show' : 'hide']() : '';
                      conf.btnMinmax !== undefined ? win.button('minmax')[conf.btnMinmax ? 'show' : 'hide']() : '';
                      conf.btnPark !== undefined ? win.button('park')[conf.btnPark ? 'show' : 'hide']() : '';
                      conf.btnStick !== undefined ? win.button('stick')[conf.btnStick ? 'show' : 'hide']() : '';
                      conf.btnHelp !== undefined ? win.button('help')[conf.btnHelp ? 'show' : 'hide']() : '';

                      if (conf.appendLayout) {
                          myLayout = win.attachLayout(conf.appendLayout);
                      } else {
                          var domElem = windowInfo.elem[0];
                          win.attachObject(domElem);
                      }
                  });

                DhxUtils.attachDhxHandlers(windows, scope.dhxHandlers);
                DhxUtils.dhxUnloadOnScopeDestroy(scope, windows);
            }
        };
    });

    app.directive('dhxWindow', function factory(DhxUtils) {
        return {
            restrict: 'E',
            scope: {
                dhxCenter: '=',
                dhxHeight: '=',
                dhxHeader: '=',
                dhxModal: '@',
                dhxKeepInViewport: '=',
                dhxShowInnerScroll: '=',
                dhxLeft: '=',
                dhxMove: '=',
                dhxPark: '=',
                dhxResize: '=',
                dhxText: '@',
                dhxTop: '=',
                dhxWidth: '=',
                dhxBtnClose: '=',
                dhxBtnMinmax: '=',
                dhxBtnPark: '=',
                dhxBtnStick: '=',
                dhxBtnHelp: '=',
                dhxAppendLayout: '@'
            },
            controller: function ($scope) {

                this.registerLayoutCallbak = function (initor) {
                    $scope.layoutInitor = initor
                }
            },
            link: function (scope, element, attrs) {
                var elem = element.detach();
                var conf = {
                    center: scope.dhxCenter,
                    height: scope.dhxHeight,
                    header: scope.dhxHeader,
                    modal: scope.dhxModal,
                    keep_in_viewport: scope.dhxKeepInViewport,
                    showInnerScroll: scope.dhxShowInnerScroll,
                    left: scope.dhxLeft,
                    move: scope.dhxMove,
                    park: scope.dhxPark,
                    resize: scope.dhxResize,
                    text: scope.dhxText,
                    top: scope.dhxTop,
                    width: scope.dhxWidth,
                    btnClose: scope.dhxBtnClose,
                    btnMinmax: scope.dhxBtnMinmax,
                    btnPark: scope.dhxBtnPark,
                    btnStick: scope.dhxBtnStick,
                    btnHelp: scope.dhxBtnHelp,
                    appendLayout: scope.dhxAppendLayout
                };

                var windows = new dhtmlXWindows();
                //windows.attachViewportTo(windowsCtrl.getContainer());

                DhxUtils.removeUndefinedProps(conf);

                var _winsId = DhxUtils.createCounter();
                var _idPerWin = DhxUtils.createCounter();

                var _getNextWindowId = function () {
                    return "wins_" + _winsId() + "_" + _idPerWin();
                };

                var win = windows.createWindow(
                  _getNextWindowId,
                  conf.left,
                  conf.top,
                  conf.width,
                  conf.height
                );

                if (conf.modal == undefined) {
                    conf.modal = true;
                }
                if (conf.center == undefined) {
                    conf.center = true;
                }

                win.setModal(conf.modal);

                conf.header != undefined ? (!conf.header ? win.hideHeader() : '') : '';
                conf.center !== undefined ? (conf.center ? win.center() : '') : '';
                conf.keep_in_viewport !== undefined ? win.keepInViewport(!!conf.keep_in_viewport) : '';
                conf.showInnerScroll !== undefined ? (conf.showInnerScroll ? win.showInnerScroll() : '') : '';
                conf.move !== undefined ? win[(conf.move ? 'allow' : 'deny') + 'Move']() : '';
                conf.park !== undefined ? win[(conf.park ? 'allow' : 'deny') + 'Park']() : '';
                conf.resize !== undefined ? win[(conf.resize ? 'allow' : 'deny') + 'Resize']() : '';
                conf.text !== undefined ? win.setText(conf.text) : '';

                conf.btnClose !== undefined ? win.button('close')[conf.btnClose ? 'show' : 'hide']() : '';
                conf.btnMinmax !== undefined ? win.button('minmax')[conf.btnMinmax ? 'show' : 'hide']() : '';
                conf.btnPark !== undefined ? win.button('park')[conf.btnPark ? 'show' : 'hide']() : '';
                conf.btnStick !== undefined ? win.button('stick')[conf.btnStick ? 'show' : 'hide']() : '';
                conf.btnHelp !== undefined ? win.button('help')[conf.btnHelp ? 'show' : 'hide']() : '';

                if (scope.layoutInitor != undefined) {
                    scope.layoutInitor(win);
                } else {
                    win.attachObject(elem[0]);
                }
                DhxUtils.attachDhxHandlers(windows, scope.dhxHandlers);
                DhxUtils.dhxUnloadOnScopeDestroy(scope, windows);
            }
        };
    });

    app.directive('dhxWindowContainer', function factory() {
        return {
            restrict: 'E',
            require: '^dhxWindows',
            scope: {},
            link: function (scope, element, attrs, windowsCtrl) {
                windowsCtrl.setContainer(element[0]);
            }
        };
    });

});