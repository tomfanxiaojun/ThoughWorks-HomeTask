(function(window, document) {
    var w = window,
        doc = document;
    var Utils = function(selector) {
        return new Utils.prototype.init(selector);
    }
    Utils.prototype = {
        constructor: Utils,
        length: 0,
        splice: [].splice,
        selector: '',
        init: function(selector) {
            if (!selector) {
                return this;
            }
            if (typeof selector === 'object') {
                this[0] = selector;
                this.length = 1;
                return this;
            } else {
                var selector = selector.trim(),
                    elm;
                if (selector.charAt(0) == '#' && !selector.match('\\s')) {
                    selector = selector.substring(1);
                    this.selector = selector;
                    elm = doc.getElementById(selector);
                    this[0] = elm;
                    this.length = 1;
                    return this;
                } else {
                    elm = doc.querySelectorAll(selector);
                    for (var i = 0; i < elm.length; i++) {
                        this[i] = elm[i];
                    }
                    this.selector = selector;
                    this.length = elm.length;
                    return this;
                }
            }

        },
        addClass: function(cls) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            for (var i = 0; i < this.length; i++) {
                if (!this[i].className.match(reg))
                    this[i].className += ' ' + cls;
            }
            return this;
        },
        removeClass: function(cls) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            for (var i = 0; i < this.length; i++) {
                if (this[i].className.match(reg))
                    this[i].className = this[i].className.replace(' ' + cls, '');
            }
            return this;
        },
        hide: function() {
            for (var i = 0; i < this.length; i++) {
                //
                if (this[i] && this[i].setAttribute) {
                    this[i].setAttribute("style", "display:none");
                } else if( this[i]){
                    this[i].style.display = "none";
                }

            }
            return this;
        },
        show: function() {
            for (var i = 0; i < this.length; i++) {
                this[i].style.display = "block";
            }
            return this;
        },
        val: function(value) {
            if (value === undefined) {
                return this[0].value;
            } else {
                this[0].value = value;
            }
            return this;
        },
        focus: function() {
            this[0].focus();
            return this;
        },
        html: function(value) {
            if (value === undefined && this[0].nodeType === 1) {
                return this[0].innerHTML;
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].innerHTML = value;
                }
            }
            return this;
        },
        text: function(val) {
            if (val === undefined && this[0].nodeType === 1) {
                return this[0].innerText;
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].innerText = val;
                }
            }
        },
        append: function(str) {
            for (var i = 0; i < this.length; i++) {
                domAppend(this[i], 'beforeend', str);
            }
            return this;
        },
        remove: function() { //只能删除自身
            for (var i = 0; i < this.length; i++) {
                this[i].parentNode.removeChild(this[i]);
            }
            return this;
        },
        //////////////////////
        ///////新增事件部分////
        //////////////////////
        on: function(type, fn) {
            for (var i = 0; i < this.length; i++) {
                if (!this[i].guid) {
                    this[i].guid = ++Utils.guid;
                    //guid 不存在，给当前dom一个guid
                    Utils.Events[Utils.guid] = {};
                    //给Events[guid] 开辟一个新对象

                    Utils.Events[Utils.guid][type] = [fn];
                    //给这个新对象，赋予事件数组 "click" : [fn1,...]

                    bind(this[i], type, this[i].guid); //绑定事件

                } else { //guid存在的情况
                    var id = this[i].guid;
                    if (Utils.Events[id][type]) {
                        //如果这存在是当前事件已经存过，不用在绑定事件
                        Utils.Events[id][type].push(fn);
                    } else {
                        //这是存新事件，所以需要重新绑定一次
                        Utils.Events[id][type] = [fn];
                        bind(this[i], type, id);
                    }
                }
            }

        },
        forEach: function(fn) {
            if (this.constructor === Utils) {
                var objs = Array.prototype.slice.call(this);
                objs.forEach(fn);
            }

        }

    }

    Utils.prototype.init.prototype = Utils.prototype;
    Utils.Events = []; //事件绑定存放的事件
    Utils.guid = 0; //事件绑定的唯一标识
    Utils.ready = function(fn) {
        doc.addEventListener('DOMContentLoaded', function() {
            fn && fn();
        }, false);
        doc.removeEventListener('DOMContentLoaded', fn, true);

    };
    Utils.ajax = function() { //直接挂载方法  可k.ajax调用
        console.log(this.constructor === Utils);
    }
  
    function bind(dom, type, guid) {
        dom.addEventListener(type, function(e) {
            for (var i = 0; i < Utils.Events[guid][type].length; i++) {
                Utils.Events[guid][type][i].call(dom, e); //正确的dom回调
            }
        }, false);
    }

    function domAppend(elm, type, str) { //实现append、after、before操作
        elm.insertAdjacentHTML(type, str);
    }
    window.$ = Utils;
})(window, document);
