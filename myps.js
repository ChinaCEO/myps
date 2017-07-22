/**
 *自封装框架by MYPS
 *模块化框架
 */

(function(w) {
    var Myps = function(selector, context) {
        this.elements = [];
        context = context || document;
        this.elements = context.querySelectorAll(selector);

    }

    Myps.prototype = {
        // 复制对象属性的方法
        extend: function(tar, source) {
            for (var i in source) {
                tar[i] = source[i];
            }
            return tar;
        }
    }

    // 基础模块
    Myps.prototype.extend(Myps.prototype, {
        // 去除字符串左边空格
        ltrim: function(str) {
            return str.replace(/(^\s*)/g, '');
        },
        // 去除字符串右边空格
        rtrim: function(str) {
            return str.replace(/(\s*$)/g, '');
        },
        // 去除字符串两边空格
        trim: function(str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        }
    });

    // 类型判断模块
    Myps.prototype.extend(Myps.prototype, {
        isString: function(val) {
            return typeof val === 'string';
        },
        isNumber: function(val) {
            return typeof val === 'number';
        },
        isBoolean: function(val) {
            return typeof val === 'boolean';
        },
        isUndefined: function(val) {
            return typeof val === 'undefined';
        },
        isObj: function(str) {
            if (str === null || typeof str === 'undefined') {
                return false;
            }
            return typeof str === 'object';
        },
        isNull: function(val) {
            return val === 'null';
        },
        isArray: function(arr) {
            if (str === null || typeof str === 'undefined') {
                return false;
            }
            // constructor属性返回对创建此对象的数组函数的引用
            return arr.constructor === Array;
        }
    });

    // 事件模块
    Myps.prototype.extend(Myps.prototype, {
        // 绑定事件
        on: function(type, fn) {
            var doms = this.elements;
            for (var i = 0, len = doms.length; i < len; i++) {
                if (doms[i].addEventListener) {
                    doms[i].addEventListener(type, fn, false);
                } else if (doms[i].attachEvent) {
                    doms[i].attachEvent('on' + type, fn);
                }
            }
            return this;
        },
        // 解除绑定
        un: function(type, fn) {
            var doms = this.elements;
            for (var i = 0, len = doms.length; i < len; i++) {
                if (doms.removeEventListener) {
                    doms.removeEventListener(type, fn, false);
                } else if (doms.detachEvent) {
                    doms.detachEvent(type, fn);
                }
            }
            return this;
        },
        // click事件 $$.click(id,fn);
        click: function(id, fn) {
            this.on(id, 'click', fn);
        },
        // 鼠标移上
        mouseover: function(id, fn) {
            this.on(id, 'mouseover', fn);
        },
        // 鼠标移开
        mouseout: function(id, fn) {
            this.on(id, 'mouseout', fn);
        },
        // 鼠标闪过
        hover: function(id, fnOver, fnOut) {
            if (fnOver) {
                this.on(id, 'mouseover', fnOver);
            }
            if (fnOut) {
                this.on(id, 'mouseout', fnOut);
            }
        },
        // 获取事件对象
        getEvent: function(event) {
            return event ? event : window.event;
        },
        // 获取目标对象
        getTarget: function(event) {
            var e = $$.getEvent(event);
            return e.target || e.srcElement;
        },
        // 阻止默认行为
        preventDefault: function(event) {
            var e = $$.getEvent(event);
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        // 阻止冒泡
        stopPropagation: function(event) {
            var e = $$.getEvent(event);
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        },
        //事件委托
        delegate: function(pid, eventType, selector, fn) {
            //参数处理
            var parent = $$.$id(pid);

            function handle(e) {
                var target = $$.GetTarget(e);
                if (target.nodeName.toLowerCase() === selector || target.id === selector || target.className.indexOf(selector) != -1) {
                    // 在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
                    // 为什么使用call，因为call可以改变this指向
                    // 大家还记得，函数中的this默认指向window，而我们希望指向当前dom元素本身
                    fn.call(target);
                }
            }
            //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
            //这里是是给元素对象绑定一个事件
            parent[eventType] = handle;
        }
    });

    w.$$ = function(selector, context) {
        return new Myps(selector, context);
    }

})(window);
