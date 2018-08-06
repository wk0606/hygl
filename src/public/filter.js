import Vue from 'vue'/**自定义过滤器 */

Vue.filter('currency', function (value) {
    if (isNaN(parseInt(value))) {
        return value
    }
    if (!value) {
        return '0.00'
    } else if (value.toString().indexOf('.') == -1) {
        return value + '.00'
    } else {
        return value
    }
});