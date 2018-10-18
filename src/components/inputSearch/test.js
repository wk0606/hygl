var render = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c('div', {
        directives: [{
            name: "clickoutside",
            rawName: "v-clickoutside",
            value: (_vm.close),
            expression: "close"
        }],
        staticClass: "el-autocomplete",
        attrs: {
            "aria-haspopup": "listbox",
            "role": "combobox",
            "aria-expanded": _vm.suggestionVisible,
            "aria-owns": _vm.id
        }
    },
    [_c('el-input', _vm._b({
        ref: "input",
        on: {
            "input": _vm.handleChange,
            "focus": _vm.handleFocus,
            "blur": _vm.handleBlur
        },
        nativeOn: {
            "keydown": [function($event) {
                if (! ('button' in $event) && _vm._k($event.keyCode, "up", 38, $event.key)) {
                    return null;
                }
                $event.preventDefault();
                _vm.highlight(_vm.highlightedIndex - 1)
            },
            function($event) {
                if (! ('button' in $event) && _vm._k($event.keyCode, "down", 40, $event.key)) {
                    return null;
                }
                $event.preventDefault();
                _vm.highlight(_vm.highlightedIndex + 1)
            },
            function($event) {
                if (! ('button' in $event) && _vm._k($event.keyCode, "enter", 13, $event.key)) {
                    return null;
                }
                _vm.handleKeyEnter($event)
            },
            function($event) {
                if (! ('button' in $event) && _vm._k($event.keyCode, "tab", 9, $event.key)) {
                    return null;
                }
                _vm.close($event)
            }]
        }
    },
    'el-input', [_vm.$props, _vm.$attrs], false), [(_vm.$slots.prepend) ? _c('template', {
        attrs: {
            "slot": "prepend"
        },
        slot: "prepend"
    },
    [_vm._t("prepend")], 2) : _vm._e(), (_vm.$slots.append) ? _c('template', {
        attrs: {
            "slot": "append"
        },
        slot: "append"
    },
    [_vm._t("append")], 2) : _vm._e(), (_vm.$slots.prefix) ? _c('template', {
        attrs: {
            "slot": "prefix"
        },
        slot: "prefix"
    },
    [_vm._t("prefix")], 2) : _vm._e(), (_vm.$slots.suffix) ? _c('template', {
        attrs: {
            "slot": "suffix"
        },
        slot: "suffix"
    },
    [_vm._t("suffix")], 2) : _vm._e()], 2), _c('el-autocomplete-suggestions', {
        ref: "suggestions",
        class: [_vm.popperClass ? _vm.popperClass: ''],
        attrs: {
            "visible-arrow": "",
            "popper-options": _vm.popperOptions,
            "placement": _vm.placement,
            "id": _vm.id
        }
    },
    _vm._l((_vm.suggestions),
    function(item, index) {
        return _c('li', {
            key: index,
            class: {
                'highlighted': _vm.highlightedIndex === index
            },
            attrs: {
                "id": (_vm.id + "-item-" + index),
                "role": "option",
                "aria-selected": _vm.highlightedIndex === index
            },
            on: {
                "click": function($event) {
                    _vm.select(item)
                }
            }
        },
        [_vm._t("default", [_vm._v("\n        " + _vm._s(item[_vm.valueKey]) + "\n      ")], {
            item: item
        })], 2)
    }))], 1)
}