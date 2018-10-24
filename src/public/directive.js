import Vue from 'vue'

/**自定义指令 */
Vue.directive('focus', {
    inserted(el) {
        el.focus()
    }
});
//调整fixed定位的位置--防止边界超出
Vue.directive('checkOutBounding', {
    update(el) {
        var _right = el.getBoundingClientRect().right;
        var _left = el.getBoundingClientRect().left;
        var w = document.body.offsetWidth;
        //右边超出了边界
        if (_right > w) {
            el.style.left = (_left - _right - 10 + w) + 'px';
        }
        //左边超出了边界
        if (_left < 0) {
            el.style.left = '10px';
        }
    }
})
/**自定义过滤器 */
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
Vue.directive('resizeImg',{
    inserted(el){
        let src=el.children[0].getAttribute('src');
        var img=new Image();
        img.src=src;
        img.onload=function(){
            if(img.width>=img.height)
                el.children[0].style.width='100%';
            else
                el.children[0].style.height='100%';
        };
    }
});