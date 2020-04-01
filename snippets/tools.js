// 判断数据全类型(除自定义)
function typeOf(target) {
    var ret = typeof(target);
    var toStr = Object.prototype.toString.call(target);
    var templ = {
        '[object Object]' : 'object',
        '[object Array]'  : 'array',
        '[object String]' : 'string-object',
        '[object Number]' : 'number-object',
        '[object Boolean]': 'boolean-object'
    }
    if(target === null) {
        return 'null'
    }else if(ret === 'object') {
        return templ[toStr];
    }else {
        return ret;
    }     
}

// 使用hash在原型上创建数组去重方法
Array.prototype.unique = function() {
    var templ = {},
        arr = [],
        len = this.length;
    for(var i = 0; i < len; i++) {
        if(!templ[this[i]]) {
            templ[this[i]] = 'uiten';
            arr.push([this[i]]);
        }
    }
    return arr;
}
// 求一组随机字符串中第一次出现的唯一的字符
function fstStr(str) {
    var templ = {};
    for(var i = 0; i < str.length; i++) {
        templ[str.charAt(i)] ? templ[str.charAt(i)]++ : templ[str.charAt(i)] = 1;
    }
    for(var prop in templ) {
        if(templ[prop] == 1) {
            console.log(prop);
            break;
        }
    }
}