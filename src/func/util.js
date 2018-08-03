var util = {
    compileStr(code) { //对字符串进行加密
        var c = String.fromCharCode(code.charCodeAt(0) + code.length)
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1))
        }
        return escape(c);
    },
    //字符串进行解密
    uncompileStr(code) {
        code = unescape(code)
        var c = String.fromCharCode(code.charCodeAt(0) - code.length)
        for (var i = 1; i < code.length; i++) {
            c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1))
        }
        return c;
    },
    getUserInfo() {
        return this.getCache('user');
    },
    getFormatDate(from) {
        var Y = new Date(from).getFullYear();
        var M = new Date(from).getMonth() + 1;
        var D = new Date(from).getDate();
        return `${Y}-${M < 10 ? '0' + M : M}-${D < 10 ? '0' + D : D}`;
    },
    /**
     * 取出距某天的n天是几号
     * target默认当前日期
     */
    getDateByDistance(n, target) {
        var target = target || this.getCurrentDate();
        const MILLSECONDS = 24 * 60 * 60 * 1000;
        var day = new Date(target).getTime() + n * MILLSECONDS;
        day = new Date(day);
        var y = day.getFullYear();
        var m = day.getMonth() + 1;
        var d = day.getDate();
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
    },
    getCurrentDate(lastWeek) {
        let date = new Date()
        if (lastWeek) {
            date = new Date(date.getTime() - 7 * 24 * 3600 * 1000)
        }
        let temp = ''
        let m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        let d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        temp = date.getFullYear() + '-' + m + '-' + d
        return temp;
    },
    formatCash(je, ws = 2) {
        je = je || 0;
        je = typeof je == 'string' ? parseFloat(je) : je;
        let zs = je.toFixed(ws).split('.')[0];
        let xs = '.' + je.toFixed(ws).split('.')[1];
        let t = '';
        zs = zs.split('').reverse().join('');
        for (let i = 0; i < zs.length; i++) {
            t += zs[i];
            if ((i + 1) % 3 === 0)
                t += ',';
        }
        t = t.split('').reverse().join('');
        if (t[0] === ',')
            t = t.substring(1)
        return '￥' + t + xs;
    },
    setTokenid(token) {
        sessionStorage.setItem(this.compileStr('tokenid'), this.compileStr(token));
    },
    //==取出token
    getTokenid() {
        let res = sessionStorage.getItem(this.compileStr('tokenid'))
        return res ? this.uncompileStr(res) : ''
    },
    //
    getBaseUrl() {
        return window.net_sign ? window.net_sign == 1 ? 'https://b.miya365.com/x3.0' : 'https://www.miya365.com/x3.0' : 'http://192.168.1.198:8080/x3.0';
    },
    //==取出服务器url
    getServerUrl() {
        return sessionStorage.getItem('serverurl');
    },
    setCache(name, data) {
        sessionStorage.setItem(name, JSON.stringify(data));
        // if (typeof data == 'string') {
        //     sessionStorage.setItem(name, data);
        // } else {
        //     sessionStorage.setItem(name, JSON.stringify(data));
        // }
    },
    getCache(name) {
        return JSON.parse(sessionStorage.getItem(name));
    },
    removeCache(name, storage = sessionStorage) {
        storage.removeItem(name);
    },
    clearCache(storage = sessionStorage) {
        storage.clear();
    },
    //根据key（默认id）取出公司信息
    getCompanyInfo(value, key = 'id', data) {
        var list = data || this.getCache('gslist');
        for (let obj of list) {
            if (obj[key] == value) {
                return obj;
            }
        }
        return {};
    },
    //根据key（默认id）取出员工信息
    getYgInfo(value, key = 'id') {
        var list = this.getCache('userlist');
        for (let obj of list) {
            if (obj[key] == value) {
                return obj;
            }
        }
        return {};
    },
    //获取套餐业务类型
    getTcYwlx(value, key = 'id') {
        var list = this.getCache('fzxxlist').filter(item => {
            return item.fzlx == 'tcywlx';
        });
        for (let obj of list) {
            if (obj[key] === value)
                return obj.value;
        }
        return '';
    },
    getProvinceAndCity() {
        return this.getCache('map');
    },
    deepCopy: function (obj) { //深度复制 对象 数组 日期
        // Handle the 3 simple types, and null or undefined
        if (null == obj || 'object' != typeof obj) return obj
        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date()
            copy.setTime(obj.getTime())
            return copy
        }

        // Handle Array
        if (obj instanceof Array) {
            var copy = []
            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = this.deepCopy(obj[i])
            }
            return copy
        }

        // Handle Object
        if (obj instanceof Object) {
            var copy = {}
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr])
            }
            return copy
        }

        throw new Error('Unable to copy obj! Its type isn\'t supported.')
    },
    /**
     * 格式化excel导入，日期格式的问题
     * @param val
     */
    formatExcelDate(val) {
        if (!val) {
            return ""
        }
        if (val.match(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/)) {
            return val
        }
        var regPos = /^\d+$/; // 非负整数
        if (regPos.test(val)) {//如果是
            let date = new Date("1900-01-01")
            date.setDate(date.getDay() + Number(val) - 2)
            return date ? this.getFormatDate(date) : val
        }
        return val
    },
    /**校验手机号 */
    vartifyPhone(phone) {
        return /^1\d{10}$/.test(phone);
    },
    //自定义权限的时候，当前公司是否归我管理
    isMyCompany(gs) {
        if (gs.qx && gs.qx.value) {
            var _temp = JSON.parse(gs.qx.value);
            var myId = this.getCache('user').id;
            if (_temp.length) {
                for (let obj of _temp) {
                    if (obj.userid == myId && !gs.yxbz)
                        return true;
                }
                return false;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    //获取我权限之内的公司--needck:是否包含仓库
    getMyGsList(needck = false) {
        var lists = this.getCache('gslist');
        var bm = this.getCache('user').ssgsbm;
        var _temp = [];
        //自定义权限的情况
        if (JSON.parse(this.getCache('user').flags).customQx) {
            for (let gs of lists) {
                if (this.isMyCompany(gs))
                    _temp.push(gs);
            }
        } else {
            for (let gs of lists) {
                if (gs.bm.indexOf(bm) == 0 && !gs.yxbz)
                    _temp.push(gs);
            }
        }
        //如果不包含仓库
        if (needck) {
            _temp = _temp.filter(item => {
                return item.lx != 4;
            });
        }
        return _temp;
    },
    /**
     * 
     * @param {*} obj1 
     * @param {*} obj2 
     * @param {*} key 不比较的key
     */
    compareEqualWidthObjects(obj1, obj2, key) {
        var t1 = Object.assign({}, obj1);
        var t2 = Object.assign({}, obj2);
        if (key) {
            delete t1[key];
            delete t2[key];
        }
        return JSON.stringify(t1) == JSON.stringify(t2) ? true : false;
    },
    /**
     * 根据key来排序
     * @param {*} array 源数据
     * @param {*} key 要排序的key
     * @param {*} type asc(默认)升序 desc降序 
     */
    sortArrayByKey(array, key, type = 'asc') {
        array.sort(function (a, b) {
            if (a[key] < b[key])
                return type == 'asc' ? -1 : 1;
            else if (a[key] > b[key])
                return type == 'asc' ? 1 : -1;
            else
                return 0;
        })
    },
    parseAddressToLng(http, dz) {
        var promise = new Promise(function (resolve, reject) {
            http('/api/x6/gps/getDzGps.do', {
                dz: dz
            }).then(res => {
                resolve(res);
            }, er => {
                reject(err);
            });
        });
        return promise;
    },
    windowResize(callback, route) {
        callback();
        window.onresize = function () {
            if (window.location.hash.indexOf(route) > 0)
                callback();
        }
    }
}
export default util;