define(['app', 'config'], function (app, config) {

    app.level = 0;

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
            require: ['?^^dhxLayoutCell','?^^dhxWindow'],
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
                dhxColFilters: '@',
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

                dhxContextMenuId: '=',
                dhxContextMenuName: '@',
                dhxContextMenuAction: '=',

                dhxAutoHeight: '@',
                dhxPaging: '=',
                dhxProcessorUrl: '@',
                dhxWin : '=?'
            },
            link: function (scope, element, attrs, ctls) {
                
                scope.uid = app.genStr(12);

                var getContextMenu = function () {
                    var menu = new dhtmlXMenuObject();
                    menu.setSkin("dhx_skyblue");
                    menu.setIconset("awesome");
                    menu.renderAsContextMenu();

                    var menuData = app.buttons[scope.dhxContextMenuId][scope.dhxContextMenuName];

                    var eventMap = {};
                    var items = menuData.map(function (item) {
                        if (item.type == "separator") {
                            return {
                                id: item.id,
                                type: item.type
                            }
                        }

                        eventMap[item.id] = item.action;

                        return {
                            id: item.id,
                            text: item.text,
                            img: item.img,
                        };
                    });

                    if (scope.dhxContextMenuAction) {
                        DhxUtils.attachDhxHandlers(menu, [
                            {
                                type: 'onClick',
                                handler: function (id) {
                                    var action = eventMap[id];
                                    var params = scope.dhxObj.contextID.split('_');
                                    scope.dhxContextMenuAction[action](params[0], params[1]);
                                }
                            }
                        ]);
                    }

                    menu.loadStruct(items);

                    DhxUtils.attachDhxHandlers(menu, scope.dhxHandlers);
                    DhxUtils.dhxUnloadOnScopeDestroy(scope, menu);

                    return menu;
                }

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

                    grid.setFilterFunc(function (name, value) {
                        // todo
                        return value;
                    });
                   
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
                    scope.dhxColFilters && grid.setFilters(scope.dhxColFilters);

                    if (scope.dhxContextMenuId && scope.dhxContextMenuName) {

                        var menu = getContextMenu();
                        grid.enableContextMenu(menu);

                        scope.$watch(
                            "dhxContextMenu",
                            function handle(newValue) {
                                if (newValue) {
                                    grid.enableContextMenu(newValue);
                                }
                            }
                        );
                    }

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

                    if (scope.dhxProcessorUrl) {
                        var myDataProcessor = new dataProcessor(config.webapi + "/" + scope.dhxProcessorUrl + "/");
                        myDataProcessor.init(grid); // link dataprocessor to the grid

                        myDataProcessor._getRowData = function (rowId, pref) {
                            var data = grid.getRowData(rowId);

                            var udata = this.obj.UserData[rowId];
                            if (udata) {
                                for (var j = 0; j < udata.keys.length; j++)
                                    if (udata.keys[j] && udata.keys[j].indexOf("__") != 0)
                                        data[udata.keys[j]] = udata.values[j];
                            }
                            return data;
                        };

                        myDataProcessor.attachEvent("onAfterUpdate", function (id, action, tid, response) {
                            if (action == "inserted") {
                                var data = grid.getRowData(id);
                                data.ID = response;

                                grid.changeRowId(id, response);
                                grid.setRowData(response, data);
                            }
                        });

                        var authCode = app.getAuthorization();
                        myDataProcessor.setTransactionMode({
                            mode: "RESTAPI",
                            headers: {
                                Authorization: authCode
                            }
                        }, false);
                    }

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
                        if (cell) {
                            cell.progressOn();
                        }

                        var url = app.getApiUrl(scope.dhxUrl);
                        var param = scope.dhxParams || {};

                        var api = $resource(url, {}, { query: { method: 'GET', isArray: !scope.dhxPaging } });

                        grid.setQuery(api.query, param, function () {
                            if (cell) {
                                cell.progressOff();
                            }
                        });
                    }

                    // Letting controller do data manipulation after data has been loaded
                    if (scope.dhxOnDataLoaded) {
                        scope.dhxOnDataLoaded(grid);
                    }

                    DhxUtils.attachDhxHandlers(grid, scope.dhxHandlers);
                    DhxUtils.dhxUnloadOnScopeDestroy(scope, grid);
                };

                if (scope.dhxWin) {
                    var grid = scope.dhxWin.attachGrid();
                    setGrid(grid,scope.dhxWin);

                    return;
                } 

                var maxLevel = -1;
                var parentCell = null;

                for (var i = 0; i < ctls.length; i++) {
                    if (ctls[i] != null && ctls[i].level > maxLevel) {
                        parentCell = ctls[i];
                        maxLevel = ctls[i].level;
                    }
                }

                if (parentCell != null) {
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
            scope: {
                dhxLayoutCode: "@",
                dhxWidth: "=", // Optional... Default is 100%. If set, use ems or pixels.
                dhxHeight: "=", // Mandatory.
                dhxUseEms: "=", // Optional... If width and height is in ems. Px is   default;
                dhxHandlers: '=',
                dhxObj: '=',
                dhxWhenDone: '=',
                dhxWin:'='
            },
            controller: function ($scope) {
                $scope.menuId = $scope.$parent.menuId;
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
            link: function (scope, element, attrs, ctrls) {
                var layoutCtrl = ctrls[0];
                var windowCtrl = ctrls[1];
                
                var setCell = function (layout) {

                    for (var i = 0; i < scope.panes.length; i++) {
                        var cell = layout.cells(letters[i]);


                        scope.panes[i].scope.dhxCell = cell;

                        scope.panes[i].attach(layout, cell);

                        // 如果cell中没有可以attach的对象则直接attachdom
                        //if (!) {

                        //    var dom = scope.panes[i].jqElem[0];
                        //    if (dom != null) {
                        //        cell.appendObject(dom);
                        //    }
                        //}

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
                
                if (windowCtrl != null) {
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
                } else if (scope.dhxWin != null) {
                    var layout = scope.dhxWin.attachLayout({
                        pattern: scope.dhxLayoutCode,
                        cells: scope.panes.map(function (paneObj) {
                            paneObj.cellConfig.id = layoutCtrl.getNextId();
                            return paneObj.cellConfig;
                        })
                    });

                    setCell(layout);
                }else {
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
                } 
            }
        };
    });

    app.directive('dhxLayoutCell', function factory(DhxUtils,$rootScope) {
        return {
            restrict: 'E',
            require: '^dhxLayout',
            scope: {
                dhxText: '@',
                dhxCell: '=?',
                dhxStatus: '=',
                dhxHideHeader: '@',
                dhxCollapsedText: '@', // If this is omitted it becomes dhxText
                dhxHeader: '=', // Expression... since it is a boolean value
                dhxWidth: '@',  // These are optional... However when specified they
                dhxHeight: '@', // should not conflict with the layout width and height
                dhxCollapse: '=', // Expression... since it is a boolean value
                dhxFixSize: '=',
                dhxWins : '=?'
            },
            controller: function ($scope, $controller, $compile) {
                $scope.menuId = $scope.$parent.menuId;

                var self = this;
                self.level = app.level++;

                $scope.creators = [];
                $scope.attach = function (layout, cell) {

                    //cell.showInnerScroll();

                    angular.forEach($scope.creators, function (creator) {
                        creator(layout, cell);
                    });

                    if (self.html) {
                        cell.appendObject(self.html);
                    }

                    if ($scope.dhxWins) {
                        var windows = new dhtmlXWindows();
                        windows.attachViewportTo(cell.cell);

                        var _winsId = DhxUtils.createCounter();
                        var _idPerWin = DhxUtils.createCounter();

                        var getNextWindowId = function () {
                            return "wins_" + _winsId + "_" + _idPerWin();
                        };

                        self.registerWindow = function (windowInfo) {
                            var conf = windowInfo.config;
                            DhxUtils.removeUndefinedProps(conf);

                            var winId = getNextWindowId();
                            var win = windows.createWindow(
                                winId,
                                conf.left,
                                conf.top,
                                conf.width,
                                conf.height
                            );

                            conf.header != undefined ? (!conf.header ? win.hideHeader() : '') : '';
                            conf.keep_in_viewport !== undefined ? win.keepInViewport(!!conf.keep_in_viewport) : '';

                            conf.move !== undefined ? win[(conf.move ? 'allow' : 'deny') + 'Move']() : '';
                            conf.park !== undefined ? win[(conf.park ? 'allow' : 'deny') + 'Park']() : '';
                            conf.resize !== undefined ? win[(conf.resize ? 'allow' : 'deny') + 'Resize']() : '';
                            conf.text !== undefined ? win.setText(conf.text) : '';

                            conf.btnClose !== undefined ? win.button('close')[conf.btnClose ? 'show' : 'hide']() : '';
                            conf.btnMinmax !== undefined ? win.button('minmax')[conf.btnMinmax ? 'show' : 'hide']() : '';
                            conf.btnPark !== undefined ? win.button('park')[conf.btnPark ? 'show' : 'hide']() : '';
                            conf.btnStick !== undefined ? win.button('stick')[conf.btnStick ? 'show' : 'hide']() : '';
                            conf.btnHelp !== undefined ? win.button('help')[conf.btnHelp ? 'show' : 'hide']() : '';

                            //conf.center !== undefined ? (conf.center ? win.center() : '') : '';
                            win.center();
                            //win.showInnerScroll();

                            //conf.showInnerScroll !== undefined ? (conf.showInnerScroll ? win.showInnerScroll() : '') : '';

                            var init = function (html) {
                                
                                var newScope = null;
                                if (windowInfo.scope) {
                                    newScope = windowInfo.scope.$new();
                                } else {
                                    newScope = $rootScope.$new();
                                }
                                
                                newScope.$win = win;
                                newScope.menuId = $scope.menuId;
                                var injectors = {
                                    "$scope": newScope
                                };

                                angular.extend(injectors, windowInfo.resolve);

                                ctrlInstantiate = $controller(windowInfo.controller, injectors, true, windowInfo.controllerAs);

                                ctrlInstantiate();

                                win.attachHTMLString($compile(html)(newScope));

                                //win.showInnerScroll();

                                $scope.$apply();
                            }

                            if (windowInfo.view) {
                                if (windowInfo.controllerUrl) {
                                    require(['text!../views/' + windowInfo.view, 'controller/' + windowInfo.controllerUrl], init);
                                } else {
                                    require(['text!../views/' + windowInfo.view], init);
                                }
                            } else {
                                var domElem = windowInfo.elem[0];
                                win.attachObject(domElem);
                            }
                        };
                    }
                }
                self.addCreator = function (creator) {
                    $scope.creators.push(creator);
                }
            },
            link: function (scope, element, attrs, ctrl) {
                
                ctrl.registerPane({
                    scope: scope,
                    elem: element.detach(),
                    attach: scope.attach,
                    status: scope.dhxStatus,
                    hideHeader: scope.dhxHideHeader,
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

    app.directive('dhxCellHtml', function factory(DhxUtils, $rootScope) {
        return {
            restrict: 'E',
            require: ['?^^dhxLayoutCell'],
            link: function (scope, element, attrs, ctrls) {
                ctrls.forEach(function (ctrl) {
                    ctrl.html = element.detach()[0];
                })
            }
        };
    });

    app.directive('dhxToolbar', function factory(DhxUtils) {
        return {
            restrict: 'E',
            require: ['?^^dhxLayoutCell', '?^^dhxWindow'],
            template: '<div></div>',
            replace: true,
            scope: {
                dhxItems: '=?',
                dhxWin: '=?',
                dhxName: '@?',
                dhxMenu: '=?'
            },
            controller: function () {
            },
            link: function (scope, element, attrs, ctrls) {

                var source = scope.dhxItems;

                if (scope.dhxMenu > 0) {
                    source = app.buttons[scope.dhxMenu][scope.dhxName];
                }

                var eventmap = {};
                source.map(function (item) {
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

                    toolbar.setSkin("dhx_skyblue");
                    toolbar.setIconset("awesome");
                    //toolbar.setIconsPath(app.getProjectRoot("assets/img/btn/"));
                    toolbar.loadStruct(source);
                    toolbar.attachEvent("onclick", function (id) {

                        var name = eventmap[id];
                        if (name && scope.$parent[name] && angular.isFunction(scope.$parent[name]))
                            scope.$parent[name].call(this);
                    });
                }

                if (scope.dhxWin) {
                    
                    var toolbar = scope.dhxWin.attachToolbar();
                    setToolbar(toolbar);

                    return;
                } 

                var layoutCtl = ctrls[0];

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

    app.directive('dhxTabbar', function factory(DhxUtils) {
        var nextTabbarId = DhxUtils.createCounter();
        return {
            restrict: 'E',
            require: ['dhxTabbar','?^^dhxLayoutCell'],
            controller: function ($scope) {

                $scope.menuId = $scope.$parent.menuId;

                this.level = 0;
                
                var _tabbarId = nextTabbarId();
                $scope.panes = [];
                var _nextTabbarPaneId = DhxUtils.createCounter();
                this.getTabbarPaneId = function () {
                    return 'tabbar_' + _tabbarId + '_' + _nextTabbarPaneId();
                };
                this.registerPane = function (tab) {
                    $scope.panes.push(tab);
                };
            },
            scope: {
                dhxObj: "=",
                dhxWidth: "=", // Optional... Default is 100%. If set, use ems or pixels.
                dhxHeight: "=", // Mandatory.
                dhxUseEms: "=", // Optional... If width and height is in ems. Px is default;
                dhxDisableScroll: "=",
                dhxHandlers: '='
            },
            link: function (scope, element, attr, ctls) {
                
                var layoutCell = ctls[1];

                var setTabBar = function (tabbar) {

                    tabbar.setArrowsMode("auto");

                    scope.dhxObj ? scope.dhxObj = tabbar : '';
                    scope.panes.forEach(function (tabInfo) {
                        tabbar.addTab(
                            tabInfo.id,
                            tabInfo.text
                        );
                        tabInfo.selected ? tabbar.tabs(tabInfo.id).setActive() : '';

                        if (!tabInfo.attach(tabbar, tabbar.tabs(tabInfo.id))) {
                            tabbar.tabs(tabInfo.id).attachObject(tabInfo.elem[0]);
                        }

                        tabbar.tabs(tabInfo.id).showInnerScroll();
                        
                    });
                    DhxUtils.attachDhxHandlers(tabbar, scope.dhxHandlers);
                    DhxUtils.dhxUnloadOnScopeDestroy(scope, tabbar);
                }

                if (layoutCell != null) {
                    layoutCell.addCreator(function (layout, cell) {
                        var tabbar = cell.attachTabbar();
                        setTabBar(tabbar);
                    });
                } else {
                    var dim = (scope.dhxUseEms ? 'em' : 'px');

                    var height = scope.dhxHeight ? (scope.dhxHeight + dim) : '100%';
                    var width = scope.dhxWidth ? (scope.dhxWidth + dim) : '100%';
                    element.css('width', width);
                    element.css('height', height);
                    element.css('display', 'block');

                    //noinspection JSPotentiallyInvalidConstructorUsage
                    var tabbar = new dhtmlXTabBar(element[0]);

                    setTabBar(tabbar);
                }

            }
        };
    })

    app.directive('dhxTabbarCell', function factory(DhxUtils) {
        return {
            restrict: 'E',
            require: ['dhxTabbarCell', '^dhxTabbar'],
            scope: {
                dhxText: '@',
                dhxSelected: '='
            },
            controller: function ($scope) {
                $scope.menuId = $scope.$parent.menuId;

                this.level = app.level++;
                
                $scope.creators = [];
                $scope.attach = function (tabbar, cell) {

                    angular.forEach($scope.creators, function (creator) {
                        creator(tabbar, cell);
                    });

                    return $scope.creators.length > 0;
                }
                this.addCreator = function (creator) {
                    $scope.creators.push(creator);
                }
            },
            link: function (scope, element, attrs, ctrls) {
                ctrls[0].level = ctrls[1].level + 1;
                
                var tabbarCtrl = ctrls[1];
                tabbarCtrl.registerPane({
                    elem: element.detach(),
                    text: scope.dhxText || "",
                    id: tabbarCtrl.getTabbarPaneId(),
                    selected: !!scope.dhxSelected,
                    attach: scope.attach,
                    //NOTE: Feel free to add aditional configuration here
                });
            }
        };
    });

    app.directive('dhxMenu', function factory(DhxUtils) {
        return {
            restrict: 'E',
            require: ['?^^dhxLayoutCell'],
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
            link: function (scope, element, attrs, ctrls) {
                //noinspection JSPotentiallyInvalidConstructorUsage
                var layoutCtl = ctrls[0];
                var domChild = $(element).children().first().detach();

                var setMenu = function (menu) {
                    menu.setSkin("dhx_skyblue");
                    menu.setIconset("awesome");
                    //menu.setIconsPath(app.getProjectRoot("assets/img/btn/"));

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

                if (layoutCtl == null || layoutCtl == undefined) {
                    scope.uid = app.genStr(12);
                    element.attr("id", "dhx_menu_" + scope.uid);
                    //element.css("background-color", "#e7f1ff");

                    var menu = new dhtmlXMenuObject(scope.dhxContextMenuMode ? undefined : element[0]);
                    setMenu(menu);
                } else {
                    layoutCtl.addCreator(function (layout, cell) {
                        var menu = cell.attachMenu();
                        setMenu(menu);
                    })
                }
            }
        };
    });

    app.directive('dhxTree', function factory(DhxUtils) {
        return {
            restrict: 'E',
            require: ['?^^dhxTabbarCell', '?^^dhxLayoutCell'],
            controller: function ($scope) {
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
                dhxEnableItemEditor:'=',
                /**
                 * preLoad and postLoad callbacks to controller for additional
                 * customization power.
                 */
                dhxConfigureFunc: '=',
                dhxOnDataLoaded: '=',

                dhxContextMenuId: '=',
                dhxContextMenuName: '@',
                dhxContextMenuAction:'=',
                dhxProcessorUrl: '@',
                dhxAfterUpdate:'&'
            },
            link: function (scope, element, attrs, ctls) {

                var getContextMenu = function () {
                    var menu = new dhtmlXMenuObject();
                    menu.setSkin("dhx_skyblue");
                    menu.setIconset("awesome");
                    menu.renderAsContextMenu();

                    var menuData = app.buttons[scope.dhxContextMenuId][scope.dhxContextMenuName];

                    var eventMap = {};
                    var items = menuData.map(function (item) {
                        if (item.type == "separator") {
                            return {
                                id: item.id,
                                type: item.type
                            }
                        }

                        eventMap[item.id] = item.action;

                        return {
                            id: item.id,
                            text: item.text,
                            img: item.img,
                        };
                    });

                    if (scope.dhxContextMenuAction) {
                        DhxUtils.attachDhxHandlers(menu, [
                            {
                                type: 'onClick',
                                handler: function (id) {
                                    var action = eventMap[id];

                                    scope.dhxContextMenuAction[action](scope.dhxTree.contextID);
                                }
                            }
                        ]);
                    }

                   

                    menu.loadStruct(items);

                    DhxUtils.attachDhxHandlers(menu, scope.dhxHandlers);
                    DhxUtils.dhxUnloadOnScopeDestroy(scope, menu);

                    return menu;
                }

                var setTree = function (tree) {

                    scope.dhxTree = tree;

                    tree.setImagePath(DhxUtils.getImagePath() + 'dhxtree_skyblue/');

                    if (scope.dhxContextMenuId && scope.dhxContextMenuName) {

                        var menu = getContextMenu();
                        tree.enableContextMenu(menu);

                        scope.$watch(
                            "dhxContextMenu",
                            function handle(newValue) {
                                if (newValue) {
                                    tree.enableContextMenu(newValue);
                                }
                            }
                        );
                    }

                    // Additional optional configuration
                    tree.enableCheckBoxes(scope.dhxEnableCheckBoxes);

                    tree.enableDragAndDrop(scope.dhxEnableDragAndDrop);
                    tree.enableHighlighting(scope.dhxEnableHighlighting);
                    tree.enableThreeStateCheckboxes(scope.dhxEnableThreeStateCheckboxes);
                    tree.enableTreeImages(scope.dhxEnableTreeImages);
                    tree.enableTreeLines(scope.dhxEnableTreeLines);
                    tree.enableItemEditor(scope.dhxEnableItemEditor);
                    
                    // Letting controller add configurations before data is parsed

                    if (scope.dhxProcessorUrl) {
                        var myDataProcessor = new dataProcessor(config.webapi + "/" + scope.dhxProcessorUrl + "/");
                        myDataProcessor.init(tree);
                        var authCode = app.getAuthorization();
                        myDataProcessor.setTransactionMode({
                            mode: "RESTAPI",
                            headers: {
                                "Authorization" : authCode
                            }
                        }, false);
                        myDataProcessor.attachEvent("onAfterUpdate", function (id, action, tid, response) {
                            
                            if (action == "inserted") {
                                tree.changeItemId(id, response);
                            } else if (action = "deleted") {
                                tree.deleteChildItems(id);
                            }

                            scope.dhxAfterUpdate({
                                data: {
                                    "id": id,
                                    "action": action,
                                    "tid": tid,
                                    "response": response
                                }
                            });
                        });
                    }

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
                
                var maxLevel = -1;
                var parentCell = null;

                for (var i = 0; i < ctls.length; i++) {
                    if (ctls[i] != null && ctls[i].level > maxLevel) {
                        parentCell = ctls[i];
                        maxLevel = ctls[i].level;
                    }
                }

                if (parentCell != null) {
                    parentCell.addCreator(function (obj, cell) {
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
            require: ['dhxWindows', '?^^dhxLayoutCell'],
            controller: function ($scope, $rootScope, $controller, $compile) {
                $scope.menuId = $scope.$parent.menuId;

                var windows = null;

                var _windowInfos = [];
                var _container = document.documentElement;

                var _winsId = nextWindowsId();
                var _idPerWin = DhxUtils.createCounter();

                var getNextWindowId = function () {
                    return "wins_" + _winsId + "_" + _idPerWin();
                };

                this.registerWindow = function (windowInfo) {
                    _windowInfos.push(windowInfo);

                    setWin(windowInfo);
                };

                this.setContainer = function (container) {
                    _container = container;
                };

                this.getContainer = function () {
                    return _container;
                };

                this.getWindowInfos = function () {
                    return _windowInfos;
                };

                this.setWins = function (wins) {
                    windows = wins;

                    _windowInfos.forEach(function (windowInfo) {
                        setWin(windowInfo);
                    });
                };

                var setWin = function (windowInfo) {
                    var conf = windowInfo.config;
                    DhxUtils.removeUndefinedProps(conf);

                    //var win = windows.createWindow("w1", 10, 10, 300, 190);
                    var winId = getNextWindowId();
                    var win = windows.createWindow(
                        winId,
                        conf.left,
                        conf.top,
                        conf.width,
                        conf.height
                    );

                    conf.header != undefined ? (!conf.header ? win.hideHeader() : '') : '';
                    conf.keep_in_viewport !== undefined ? win.keepInViewport(!!conf.keep_in_viewport) : '';
                    
                    conf.move !== undefined ? win[(conf.move ? 'allow' : 'deny') + 'Move']() : '';
                    conf.park !== undefined ? win[(conf.park ? 'allow' : 'deny') + 'Park']() : '';
                    conf.resize !== undefined ? win[(conf.resize ? 'allow' : 'deny') + 'Resize']() : '';
                    conf.text !== undefined ? win.setText(conf.text) : '';

                    conf.btnClose !== undefined ? win.button('close')[conf.btnClose ? 'show' : 'hide']() : '';
                    conf.btnMinmax !== undefined ? win.button('minmax')[conf.btnMinmax ? 'show' : 'hide']() : '';
                    conf.btnPark !== undefined ? win.button('park')[conf.btnPark ? 'show' : 'hide']() : '';
                    conf.btnStick !== undefined ? win.button('stick')[conf.btnStick ? 'show' : 'hide']() : '';
                    conf.btnHelp !== undefined ? win.button('help')[conf.btnHelp ? 'show' : 'hide']() : '';

                    //conf.center !== undefined ? (conf.center ? win.center() : '') : '';
                    win.center();
                    //win.showInnerScroll();
                    
                    //conf.showInnerScroll !== undefined ? (conf.showInnerScroll ? win.showInnerScroll() : '') : '';

                    var init = function (html) {

                        var newScope = null;
                        if (windowInfo.scope) {
                            newScope = windowInfo.scope.$new();
                        } else {
                            newScope = $rootScope.$new();
                        }

                        newScope.$win = win;

                        var injectors = {
                            "$scope": newScope
                        };

                        angular.extend(injectors, windowInfo.resolve);

                        ctrlInstantiate = $controller(windowInfo.controller, injectors, true, windowInfo.controllerAs);

                        ctrlInstantiate();
                       
                        win.attachHTMLString($compile(html)(newScope));

                        //win.showInnerScroll();

                        $scope.$apply();
                    }

                    if (windowInfo.view) {
                        if (windowInfo.controllerUrl) {
                            require(['text!../views/' + windowInfo.view, 'controller/' + windowInfo.controllerUrl], init);
                        } else {
                            require(['text!../views/' + windowInfo.view], init);
                        }
                    } else {
                        var domElem = windowInfo.elem[0];
                        win.attachObject(domElem);
                    }
                };
            },
            scope: {
                dhxHandlers: '='
            },
            link: function (scope, element, attrs, ctrls) {

                var windowsCtrl = ctrls[0];
                
                if (ctrls[1] != null) {

                    ctrls[1].addCreator(function (layout, cell) {

                        $("<div id='layoutCellWins' style='display: none;'></div>").css({
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden'
                        }).appendTo("body");

                        cell.attachObject("layoutCellWins");

                        // init windows
                        dhxWins = new dhtmlXWindows();
                        // rendering viewport as an existing object on page
                        // which already attached to layout
                        dhxWins.attachViewportTo("layoutCellWins");
                        
                        windowsCtrl.setWins(dhxWins);
                        
                    });

                } else {
                    
                    //noinspection JSPotentiallyInvalidConstructorUsage
                    var windows = new dhtmlXWindows();
                    windows.attachViewportTo(windowsCtrl.getContainer());

                    windowsCtrl.setWins(windows);

                    DhxUtils.attachDhxHandlers(windows, scope.dhxHandlers);
                    DhxUtils.dhxUnloadOnScopeDestroy(scope, windows);
                    //setWin(windows);
                }
            }
        };
    });

    app.directive('dhxWindow', function factory(DhxUtils) {
        return {
            restrict: 'E',
            scope: {
                dhxWin: '=',
                dhxWinOption: '=',
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
                dhxBtnHelp: '='
            },
            require: ['?^^dhxWindows', '?^^dhxWindowsc','?^^dhxLayoutCell'],
            controller: function ($scope) {
                $scope.menuId = $scope.$parent.menuId;

                this.level = app.level++;

                $scope.creators = [];
                this.addCreator = function (creator) {
                    $scope.creators.push(creator);
                }
            },
            link: function (scope, element, attrs, ctrls) {

                var elem = element.detach();
                
                var windowsCtrl = ctrls[0];

                if (ctrls[1] != null) {
                    windowsCtrl = ctrls[1];
                }

                if (ctrls[2] != null) {
                    windowsCtrl = ctrls[2];
                }
               
                if (scope.dhxWinOption) {
                    scope.dhxWinOption.elem = elem;
                    windowsCtrl.registerWindow(scope.dhxWinOption);
                }else{
                    var conf = {
                        center: scope.dhxCenter,
                        height: scope.dhxHeight,
                        header: scope.dhxHeader,
                        modal: scope.dhxModal,
                        keep_in_viewport: scope.dhxKeepInViewport,
                        showInnerScroll: scope.dhxShowInnerScroll,
                        left: scope.dhxLeft ? scope.dhxLeft : 0,
                        move: scope.dhxMove,
                        park: scope.dhxPark,
                        resize: scope.dhxResize,
                        text: scope.dhxText,
                        top: scope.dhxTop ? scope.dhxTop : 0,
                        width: scope.dhxWidth,
                        btnClose: scope.dhxBtnClose,
                        btnMinmax: scope.dhxBtnMinmax,
                        btnPark: scope.dhxBtnPark,
                        btnStick: scope.dhxBtnStick,
                        btnHelp: scope.dhxBtnHelp,
                    };
                    windowsCtrl.registerWindow({
                        elem: elem,
                        config: conf
                    });
                }
            }
        };
    });

    app.directive('dhxForm', function factory(DhxUtils) {
        return {
            restrict: 'E',
            require: ['?^^dhxTabbarCell', '?^^dhxLayoutCell'],
            scope: {
                'formData':'='
            },
            link: function (scope, element, attrs, ctls) {

                var setForm = function (form) {
                    
                    scope.$watch("formData", function (newval, oldval) {
                        if (newval) {
                            form.loadStruct(scope.formData);
                        }
                    });
                }

                var maxLevel = -1;
                var parentCell = null;

                for (var i = 0; i < ctls.length; i++) {
                    if (ctls[i] != null && ctls[i].level > maxLevel) {
                        parentCell = ctls[i];
                        maxLevel = ctls[i].level;
                    }
                }
                debugger;

                if (parentCell != null) {
                    parentCell.addCreator(function (obj, cell) {
                        var form = cell.attachForm();
                        setForm(form);
                    });
                } else {
                    var form = new dhtmlXForm(element[0], scope.formData);

                    setForm(form);
                }
            }
        };
    })

});