﻿//for dhtmlx object prototype
//修正attachHTMLString在ie8下丢失style节点
dhtmlXCellObject.prototype.attachHTMLString__old = dhtmlXCellObject.prototype.attachHTMLString;
dhtmlXCellObject.prototype.attachHTMLString = function (str) {
    if (_isIE <= 8) {
        $(str).appendTo(this.cell.childNodes[this.conf.idx.cont]);
    }
    else {
        dhtmlXCellObject.prototype.attachHTMLString__old.apply(this, arguments);
    }
};

//修改tree的userData机制,直接从属性中取得userData
dhtmlXTreeObject.prototype._parseItem__old = dhtmlXTreeObject.prototype._parseItem;
dhtmlXTreeObject.prototype._parseItem = function (c, temp, preNode, befNode) {
    this._currentItem = c.get_all();
    dhtmlXTreeObject.prototype._parseItem__old.apply(this, arguments);
    
    var list = ["id", "text", "open", "item", "nocheckbox", "userdata"];
    for (var k in this._currentItem)
        if (k != "id" && k != "text" && k != "open" && k != "item" && k != "child" && k != "nocheckbox" && k != "userdata") {
            
            this.setUserData(this._currentItem.id, k, this._currentItem[k]);
        }

    this._currentItem = null;
};

//修改tree取userData机制,没有传入name时全部返回
dhtmlXTreeObject.prototype.getUserData__old = dhtmlXTreeObject.prototype.getUserData;
dhtmlXTreeObject.prototype.getUserData = function (itemId, name) {
    if (name)
        return dhtmlXTreeObject.prototype.getUserData__old.apply(this, arguments);
    else {
        var sNode = this._globalIdStorageFind(itemId, 0, true);
        if (!sNode) return;

        var data = {};
        
        for (var i in sNode.userData)
            if (typeof (sNode.userData[i]) != "function")
                data[i.replace("t_", "")] = sNode.userData[i];
        return data;
    }
};

//修改树节点的创建方法以支持数据中有icon生成<i class='icon'></i>
//dhtmlXTreeObject.prototype._createItem = function (acheck, itemObject, mode) {
//    var table = document.createElement('table');
//    table.cellSpacing = 0; table.cellPadding = 0;
//    table.border = 0;

//    if (this.hfMode) table.style.tableLayout = "fixed";
//    table.style.margin = 0; table.style.padding = 0;

//    var tbody = document.createElement('tbody');
//    var tr = document.createElement('tr');

//    var td1 = document.createElement('td');
//    td1.className = "standartTreeImage";

//    if (this._txtimg) {
//        var img0 = document.createElement("div");
//        td1.appendChild(img0);
//        img0.className = "dhx_tree_textSign";
//    }else {
//        var img0 = this._getImg(itemObject.id);
//        img0.border = "0";
//        if (img0.tagName == "IMG") img0.align = "absmiddle";
//        td1.appendChild(img0); img0.style.padding = 0; img0.style.margin = 0;
//        img0.style.width = this.def_line_img_x; img0.style.height = this.def_line_img_y;
//    }

//    var td11 = document.createElement('td');
   
//    var inp = this._getImg(this.cBROf ? this.rootId : itemObject.id);
//    inp.checked = 0; this._setSrc(inp, this.imPath + this.checkArray[0]); inp.style.width = "18px"; inp.style.height = "18px";
//    //can cause problems with hide/show check

//    if (!acheck) td11.style.display = "none";
//    td11.appendChild(inp);
//    if ((!this.cBROf) && (inp.tagName == "IMG")) inp.align = "absmiddle";
//    inp.onclick = this.onCheckBoxClick;
//    inp.treeNod = this;
//    inp.parentObject = itemObject;
//    if (!window._KHTMLrv) td11.width = "20px";
//    else td11.width = "16px";

//    var td12 = document.createElement('td');
//    td12.className = "standartTreeImage";

//    //add by liuhuisheng 20150209 start for support iconClass
//    var iconCls = (this._currentItem || {}).icon;
//    if (iconCls) {
//        var img = document.createElement("i");
//        img.className = iconCls;
//        img.style.fontSize = "16px";
//        img.style.color = "#ff5722";
//        img.style.paddingTop = "4px";
//        td12.appendChild(img);

//        img.onmousedown = this._preventNsDrag; img.ondragstart = this._preventNsDrag;
//        if (this._aimgs) {
//            img.parentObject = itemObject;
//            img.onclick = this.onRowSelect;
//        }
//    }
//    else {
//        var img = this._getImg(this.timgen ? itemObject.id : this.rootId);
//        img.onmousedown = this._preventNsDrag; img.ondragstart = this._preventNsDrag;
//        img.border = "0";
//        if (this._aimgs) {
//            img.parentObject = itemObject;
//            if (img.tagName == "IMG") img.align = "absmiddle";
//            img.onclick = this.onRowSelect;
//        }
//        if (!mode) this._setSrc(img, this.iconURL + this.imageArray[0]);
//        td12.appendChild(img); img.style.padding = 0; img.style.margin = 0;
//    }
//    //add by liuhuisheng 20150209 end

//    if (this.timgen) {
//        td12.style.width = img.style.width = this.def_img_x; img.style.height = this.def_img_y;
//    }
//    else {
//        img.style.width = "0px"; img.style.height = "0px";
//        if (_isOpera || window._KHTMLrv) td12.style.display = "none";
//    }


//    var td2 = document.createElement('td');
//    td2.className = "standartTreeRow";

//    itemObject.span = document.createElement('span');
//    itemObject.span.className = "standartTreeRow";
//    if (this.mlitems) {
//        itemObject.span.style.width = this.mlitems;
//        itemObject.span.style.display = "block";
//    }
//    else td2.noWrap = true;
//    if (_isIE && _isIE > 7) td2.style.width = "999999px";
//    else if (!window._KHTMLrv) td2.style.width = "100%";
 
//    itemObject.span.innerHTML = itemObject.label;
//    td2.appendChild(itemObject.span);
//    td2.parentObject = itemObject; td1.parentObject = itemObject;
//    td2.onclick = this.onRowSelect; td1.onclick = this.onRowClick; td2.ondblclick = this.onRowClick2;
//    if (this.ettip)
//        tr.title = itemObject.label;

//    if (this.dragAndDropOff) {
//        if (this._aimgs) { this.dragger.addDraggableItem(td12, this); td12.parentObject = itemObject; }
//        this.dragger.addDraggableItem(td2, this);
//    }

//    itemObject.span.style.paddingLeft = "5px"; itemObject.span.style.paddingRight = "5px"; td2.style.verticalAlign = "";
//    td2.style.fontSize = "10pt"; td2.style.cursor = this.style_pointer;
//    tr.appendChild(td1); tr.appendChild(td11); tr.appendChild(td12);
//    tr.appendChild(td2);
//    tbody.appendChild(tr);
//    table.appendChild(tbody);

//    if (this.ehlt || this.checkEvent("onMouseIn") || this.checkEvent("onMouseOut")) {//highlighting
//        tr.onmousemove = this._itemMouseIn;
//        tr[(_isIE) ? "onmouseleave" : "onmouseout"] = this._itemMouseOut;
//    }
//    return table;
//};

dhtmlXTreeObject.prototype._dp_init = function (dp) {
    dp.attachEvent("insertCallback", function (upd, id, parent) {
        var data = dhx4.ajax.xpath(".//item", upd);
        var text = data[0].getAttribute('text');
        this.obj.insertNewItem(parent, id, text, 0, 0, 0, 0, "CHILD");
        
    });

    dp.attachEvent("updateCallback", function (upd, id, parent) {
        var data = dhx4.ajax.xpath(".//item", upd);
        var text = data[0].getAttribute('text');
        this.obj.setItemText(id, text);
        if (this.obj.getParentId(id) != parent) {
            this.obj.moveItem(id, 'item_child', parent);
        }
        this.setUpdated(id, true, 'updated');
    });

    dp.attachEvent("deleteCallback", function (upd, id, parent) {
        this.obj.setUserData(id, this.action_param, "true_deleted");
        this.obj.deleteItem(id, false);
    });

    dp._methods = ["setItemStyle", "", "changeItemId", "deleteItem"];
    this.attachEvent("onEdit", function (state, id) {
        if (state == 3)
            dp.setUpdated(id, true)
        return true;
    });
    this.attachEvent("onDrop", function (id, id_2, id_3, tree_1, tree_2) {
        if (tree_1 == tree_2)
            dp.setUpdated(id, true);
    });
    this._onrdlh = function (rowId) {
        var z = dp.getState(rowId);
        if (z == "inserted") { dp.set_invalid(rowId, false); dp.setUpdated(rowId, false); return true; }
        if (z == "true_deleted") { dp.setUpdated(rowId, false); return true; }

        dp.setUpdated(rowId, true, "deleted")
        return false;
    };
    this._onradh = function (rowId) {
        dp.setUpdated(rowId, true, "inserted")
    };
    dp._getRowData = function (rowId) {
        var data = {};
        var z = this.obj._globalIdStorageFind(rowId);
        var z2 = z.parentObject;

        var i = 0;
        for (i = 0; i < z2.childsCount; i++)
            if (z2.childNodes[i] == z) break;

        data["ID"] = z.id;
        data["NodeID"] = z.id;
        data["ParentID"] = z2.id;
        data["Order"] = i;
        data["Text"] = z.span.innerHTML;
        
        z2 = (z._userdatalist || "").split(",");
        for (i = 0; i < z2.length; i++)
            data[z2[i]] = z.userData["t_" + z2[i]];

        return data;
    };
};

//================================修改grid数据加载机制=========================================
//dhtmlXGridObject.prototype.entBox.onselectstart = function () {
//    return true;
//};

dhtmlXGridObject.prototype.setQuery = function () {
    var self = this;
    var query = arguments[0];
    self.queryParams = arguments[1] || {};
    var loaded = arguments[2];
    self.query = function () {
        //构建请求参数
        var paging = {};
        if (this.pagingOn) 
            paging = { pageindex: self.currentPage,pagesize: self.rowsBufferOutSize};
        else if (this._srnd) 
            paging = { pageindex: 1, pagesize: self._dpref };
        
        var param = $.extend({}, self.queryParams, paging, arguments[0]);

        //如果是分页加载，则不清空原数据
        var ispaging = arguments[1];
        if (!ispaging) {
            try {
                var state=self.getSortingState();
                self.clearAll();
                if (state.length == 2)
                    self.setSortImgState(true, state[0], state[1]);
            }catch(e){}
        }
        
        //查询数据
        self.callEvent("onXLS", [self]);
       
        query(param, function (d) {
            
            d = self.convertSource(d);

            self.parse(d, "json");
            self.callEvent("onXLE", [self, 0, 0, d]);

            if (loaded != undefined && typeof (loaded) === "function") {
                loaded(self);
            }

            var cols = [];
            if (d.total > 0) {
                for (var key in d.rows[0]) {
                    cols.push(key);
                }
            }
        });

        self.queryParams = param;
    };
    self.query(self.queryParams);
};

dhtmlXGridObject.prototype.convertSource = function (data) {
    if (data.TotalCount != undefined) {
        return {
            pageCount: data.PageCount,
            rows: data.Source,
            total: data.TotalCount
        };
    } else {
        var source = [];
        angular.forEach(data, function (item) {
            source.push(item);
        });

        return {
            rows: source,
            total: source.length
        };
    }
};



dhtmlXGridObject.prototype.setFields = function () {
    var filedText=arguments[0]||'|';
    if (filedText.indexOf('|') == -1)
        return;

    var arr = filedText.split('|');
    this._idField = arr[0];
    this._fields = arr[1].split(',');


    this.setColumnIds(this._fields.join(','));
};

dhtmlXGridObject.prototype.load_old = dhtmlXGridObject.prototype.load;
dhtmlXGridObject.prototype.load = function (url, call, type) {
    if (!this.xmlFileUrl)
        this.xmlFileUrl = url;

    //add by liuhuisheng start 处理参数
    var req = {};
    if (url.indexOf("?") != -1) {
        var str = url.split("?")[1];
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            req[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
 
    if (this.pagingOn) {
        req.page = this.currentPage;
        req.rows = this.rowsBufferOutSize;
    }

    if (!req.page && req.posStart && req.count) {
        req.page = (req.posStart/req.count)+1;
        req.rows = req.count;
        delete req.count;
        delete req.posStart;
    }

    if (!req.page && this._srnd) {
        req.page = 1;
        req.rows = this._dpref;
    }

    var state = this.getSortingState();
    if (state.length == 2) {
        req.sort = this._fields[state[0]];
        req.order = state[1]=='des'?'desc':'asc';
    }
     
    var args="";
    for (var k in req)
        args += (args ? "&" : "?") + k + "=" + req[k];
    url = url.split("?")[0] + args;
    //add by liuhuisheng end 

    dhtmlXGridObject.prototype.load_old.apply(this, arguments);
}
 
dhtmlXGridObject.prototype._process_json_old = dhtmlXGridObject.prototype._process_json;
dhtmlXGridObject.prototype._process_json = function (data, mode) {
    function convertToDhxJson(data) {
        var cols = this._fields;
        var key = this._idField;

        var pos = 0;
        if (data.pos>=0)
            pos = data.pos;
        else {
            if (this.pagingOn)
                pos = (this.currentPage - 1) * this.rowsBufferOutSize;
            else if (this._srnd && this._current_load)
                pos = this._current_load[0];
        }

        var toArray = function (row, cols) {
            var arr = [];
            for (var i in cols)
                arr.push(row[cols[i]]);

            return arr;
        };

        if (data.total>=0 && data.rows) {
            var d = {};
            d.total_count = data.total;
            d.pos = pos;
            d.rows = [];
            for (var i in data.rows) {
                var r = {};
                r.id = data.rows[i][key];
                this.onJsonRowConvert && this.onJsonRowConvert(r.id, data.rows[i], data);
                r.data = toArray(data.rows[i], cols);
                d.rows.push(r);
            }

            return d;
        }
        else {
            return data;
        }
    }
    if (data&&data.xmlDoc){
        eval("dhtmlx.temp=" + data.xmlDoc.responseText + ";");
        data = convertToDhxJson.call(this,dhtmlx.temp);
    } else if (data && data.rows && data.total>=0) {
        data = convertToDhxJson.call(this,data);
    }
    dhtmlXGridObject.prototype._process_json_old.apply(this,arguments);
}

dhtmlXGridObject.prototype.sortRows_old = dhtmlXGridObject.prototype.sortRows;
dhtmlXGridObject.prototype.sortRows = function (col, type, order) {
    order = (order || "asc").toLowerCase();
    type = (type || this.fldSort[col]);
    col = col || 0;

    if (type == "server" && this.query) {
        var param = {};
        param.sort = this._fields[col];
        param.order = order == 'des' ? 'desc' : order;
        this.query(param);
    } else {
        dhtmlXGridObject.prototype.sortRows_old.apply(this, arguments);
    }
};

dhtmlXGridObject.prototype.render_dataset = function(min, max){ 
    //normal mode - render all
    //var p=this.obj.parentNode;
    //p.removeChild(this.obj,true)
    if (this._srnd){
        if (this._fillers)
            return this._update_srnd_view();
	
        max=Math.min((this._get_view_size()+(this._srnd_pr||0)), this.rowsBuffer.length);
			
    }
	
    if (this.pagingOn){
        min=Math.max((min||0),(this.currentPage-1)*this.rowsBufferOutSize);
        max=Math.min(this.currentPage*this.rowsBufferOutSize, this.rowsBuffer.length)
    } else {
        min=min||0;
        max=max||this.rowsBuffer.length;
    }
	
    for (var i = min; i < max; i++){
        var r = this.render_row(i)
	
        if (r == -1){
            if (this.xmlFileUrl){
                if (this.callEvent("onDynXLS",[i,(this._dpref?this._dpref:(max-i))]))
                    this.load(this.xmlFileUrl+getUrlSymbol(this.xmlFileUrl)+"posStart="+i+"&count="+(this._dpref?this._dpref:(max-i)), this._data_type);
            } else if (this.query) { //add by liuhuisheng
                this.query({}, true);
            }
            max=i;
            break;
        }
						
        if (!r.parentNode||!r.parentNode.tagName){ 
            this._insertRowAt(r, i);
            if (r._attrs["selected"] || r._attrs["select"]){
                this.selectRow(r,r._attrs["call"]?true:false,true);
                r._attrs["selected"]=r._attrs["select"]=null;
            }
        }
			
							
        if (this._ads_count && i-min==this._ads_count){
            var that=this;
            this._context_parsing=this._context_parsing||this._parsing;
            return this._contextCallTimer=window.setTimeout(function(){
                that._contextCallTimer=null;
                that.render_dataset(i,max);
                if (!that._contextCallTimer){
                    if(that._context_parsing)
                        that.callEvent("onXLE",[])
                    else 
                        that._fixAlterCss();
                    that.callEvent("onDistributedEnd",[]);
                    that._context_parsing=false;
                }
            },this._ads_time)
        }
    }
    if (this._ads_count && i == max)
        this.callEvent("onDistributedEnd",[]);
	
    if (this._srnd&&!this._fillers){
        var add_count = this.rowsBuffer.length-max;
        this._fillers = [];
        if (this._fake) this._fake._fillers = [];

        while (add_count > 0){
            var add_step = (_isIE || window._FFrv)?Math.min(add_count, 50000):add_count;
            var new_filler = this._add_filler(max, add_step);
            if (new_filler)
                this._fillers.push(new_filler);
            add_count -= add_step;
            max += add_step;
        }				
    }
	
    //p.appendChild(this.obj)
    this.setSizes();
};

dhtmlXGridObject.prototype._update_srnd_view = function () {
    var min = Math.floor(this.objBox.scrollTop / this._srdh);
    var max = min + this._get_view_size();
    if (this.multiLine) {
        // Calculate the min, by Stephane Bernard
        var pxHeight = this.objBox.scrollTop;
        min = 0;
        while (pxHeight > 0) {
            pxHeight -= this.rowsCol[min] ? this.rowsCol[min].offsetHeight : this._srdh;
            min++;
        }
        // Calculate the max
        max = min + this._get_view_size();
        if (min > 0) min--;
    }
    max += (this._srnd_pr || 0);//pre-rendering
    if (max > this.rowsBuffer.length) max = this.rowsBuffer.length;

    for (var j = min; j < max; j++) {
        if (!this.rowsCol[j]) {
            var res = this._add_from_buffer(j);
            if (res == -1) {
                if (this.xmlFileUrl) {
                    if (this._dpref && this.rowsBuffer[max - 1]) {
                        //we have last row in sett, assuming that we in scrolling up process
                        var rows_count = this._dpref ? this._dpref : (max - j)
                        var start_pos = Math.max(0, Math.min(j, max - this._dpref));
                        this._current_load = [start_pos, max - start_pos];
                    } else
                        this._current_load = [j, (this._dpref ? this._dpref : (max - j))];
                    if (this.callEvent("onDynXLS", this._current_load)) {
                        this.load(this.xmlFileUrl + getUrlSymbol(this.xmlFileUrl) + "posStart=" + this._current_load[0] + "&count=" + this._current_load[1], this._data_type);
                        break;
                    }
                } else if (this.query) {
                    if (this._dpref && this.rowsBuffer[max - 1]) {
                        //we have last row in sett, assuming that we in scrolling up process
                        var rows_count = this._dpref ? this._dpref : (max - j)
                        var start_pos = Math.max(0, Math.min(j, max - this._dpref));
                        this._current_load = [start_pos, max - start_pos];
                    } else
                        this._current_load = [j, (this._dpref ? this._dpref : (max - j))];
                    if (this.callEvent("onDynXLS", this._current_load)) {
                        this.query({ page: (this._current_load[0] / this._dpref + 1), rows: this._dpref }, true);
                        break;
                    }
                }
                return;
            } else {
                if (this._tgle) {
                    this._updateLine(this._h2.get[this.rowsBuffer[j].idd], this.rowsBuffer[j]);
                    this._updateParentLine(this._h2.get[this.rowsBuffer[j].idd], this.rowsBuffer[j]);
                }
                if (j && j == (this._realfake ? this._fake : this)["_r_select"]) {
                    this.selectCell(j, this.cell ? this.cell._cellIndex : 0, true);
                }
            }
        }
    }
    if (this._fake && !this._realfake && this.multiLine)
        this._fake.objBox.scrollTop = this.objBox.scrollTop;
}

dhtmlXGridObject.prototype.collectValues_old = dhtmlXGridObject.prototype.collectValues;
dhtmlXGridObject.prototype.collectValues = function (c) {
    //if (this._srnd) {
    //    return [];
    //}
    return dhtmlXGridObject.prototype.collectValues_old.apply(this, arguments);
}

dhtmlXGridObject.prototype._get_cell_value_old = dhtmlXGridObject.prototype._get_cell_value;
dhtmlXGridObject.prototype._get_cell_value = function (row, ind, method) {
    if (!row) return null;
    return dhtmlXGridObject.prototype._get_cell_value_old.apply(this, arguments);
}

dhtmlXGridObject.prototype._pgn_toolbar_old = dhtmlXGridObject.prototype._pgn_toolbar;
dhtmlXGridObject.prototype._pgn_toolbar = function (page, start, end) {
    dhtmlXGridObject.prototype._pgn_toolbar_old.apply(this, arguments);
    if (this._WTDef[1]) {
        if (this.getRowsNum())
            this.aToolBar.setItemText('results', "<div style='width:100%; text-align:center'>"
                + this.i18n.paging.records + (start + 1) + this.i18n.paging.to + end
                + " 共" + this.rowsBuffer.length + "条"
                + "</div>");
    }
};


dhtmlXGridObject.prototype.filterBy = function (column, value, preserve) {
    var params ={};
    for(var i in column)
        params[this._fields[column[i]]] = value[i];
 
    if (this.xmlFileUrl) {
        var args = '';
        for (var i in params) 
            if (params[i])
                args += (args ? '&' : '') + i + '=' + params[i];

        this.load(this.xmlFileUrl + getUrlSymbol(this.xmlFileUrl) + args, this._data_type);
    }else if (this.query) {
        this.query(params);
    }
};


dhtmlXGridObject.prototype.getRowData = function ( /*string*/ rowId) {
    var result = {};
    var colsNum = this.getColumnsNum();
    for (var index = 0; index < colsNum; index++) {
        var colId = this.getColumnId(index);
        if (colId) {
            result[colId] = this.cells(rowId, index).getValue();
        }
    }
    // todo
    result.ID = rowId;
    return result;
};

dhtmlXGridObject.prototype.setRowData = function ( /*string*/ rowId, /*json*/ rowJson) {
    var colsNum = this.getColumnsNum();
    for (var index = 0; index < colsNum; index++) {
        var colId = this.getColumnId(index);
        if (colId && rowJson.hasOwnProperty(colId)) {
            this.cells(rowId, index).setValue(rowJson[colId]);
        }
    }
};

dhtmlXGridObject.prototype.setFilters = function (filters) {
    
    this.colFilters = filters.split(',');
}
dhtmlXGridObject.prototype.setFilterFunc = function (func) {
    dhtmlXGridObject.prototype.getFilterValue = function (name, value) {

        return func(name, value);
    };
}

dhtmlXGridObject.prototype.cells4 = function (cell) {
    var type = window["eXcell_" + (cell._cellType || this.cellType[cell._cellIndex])];
    
    if (type) {
        if (this.colFilters && this.colFilters[cell._cellIndex].length != "") {
            return new type(cell, this.colFilters[cell._cellIndex]);
        } else {
            return new type(cell);
        }
    }
}

//============================================================================================

//function eXcell_roch(cell) {
//    if (cell) {
//        this.cell = cell;
//        this.grid = this.cell.parentNode.grid;
//    }
//    this.getValue = function () {
//        return this.cell.chstate ? this.cell.chstate.toString() : "0";
//    }
//}
//eXcell_roch.prototype = new eXcell;
//eXcell_roch.prototype.setValue = function (val) {
//    this.cell.style.verticalAlign = "middle"; //nb:to center checkbox in line
//    //val can be int
//    if (val) {
//        val = val.toString()._dhx_trim();

//        if ((val == "false") || (val == "0"))
//            val = "";
//    }

//    if (val) {
//        val = "1";
//        this.cell.chstate = "1";
//    } else {
//        val = "0";
//        this.cell.chstate = "0"
//    }
//    var obj = this;
//    this.setCValue("<img src='" + this.grid.imgURL + "item_chk" + val + ".gif'>",this.cell.chstate);
//}

function eXcell_filter(cell,filter) { //the eXcell name is defined here
    if (cell) {                // the default pattern, just copy it
        
        this.cell = cell;
        this.grid = this.cell.parentNode.grid;
    }
    this.edit = function () { }  //read-only cell doesn't have edit method
    // the cell is read-only, so it's always in the disabled state
    this.isDisabled = function () { return true; }
    this.setValue = function (val) {
        if (filter) {
            this.setCValue(this.grid.getFilterValue(filter, val), val);
        } else {
            this.setCValue(val, val);
        }
        
    }
}
eXcell_filter.prototype = new eXcell;// nests all other methods from the base class