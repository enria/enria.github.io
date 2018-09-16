Vue.component("tp-folder", {
    props: ["folder", "name", "prop_display", "current_blog"],
    data: function () {
        return {
            display: !!this.prop_display
        }
    },
    template: `
            <div>
                <span v-if="name" @click="display=!display"><i class="fas" :class="[display?'fa-caret-down':'fa-caret-right']" style="font-size:16px;"></i> <i class="fas fa-folder"></i>{{name}}</span>
                <transition name="slide-fade">
                    <ul v-show="display">
                        <li v-for="(value,key) in folder" :class="{active:current_blog&&value.type=='blob'&&current_blog.sha==value.sha}">
                            <template v-if="!value.type">
                                <tp-folder :folder="value" :current_blog="current_blog" :name="key" @choose-blog="$emit('choose-blog',$event)"></tp-folder>
                            </template>
                            <template v-if="value.type=='blob'" >
                                <span @click="$emit('choose-blog',value)"><i class="fas fa-file-alt"></i>&nbsp;{{key}}</span>
                            </template>
                        </li>
                    </ul>    
                </transition>
            </div>`
})
Vue.component('tp-menu', {
    props: ['folder', "current_blog"],
    data: function () {
        return {}
    },
    template: `<div style="margin-left:-15px;"><tp-folder :folder="folder" :current_blog="current_blog" :prop_display="true" @choose-blog="$emit('choose-blog',$event)"></tp-folder></div>`
});
Vue.component("tp-header", {
    props: ["header", "cur_header"],
    data: function () {
        return {}
    },
    template: `
            <div>
                <span :class="{active:cur_header==header.id}"  @click="$emit('choose-header',header.id)">{{header.name}}</span>
                <ul>
                    <li v-for="child in header.children">
                        <tp-header :header="child" :cur_header="cur_header" @choose-header="$emit('choose-header',$event)"></tp-header>
                    </li>
                </ul>    
            </div>`
})
Vue.component('tp-outline', {
    props: ["outline", "cur_header"],
    data: function () {
        return {}
    },
    template: `
    <ul>
        <li v-for="child in outline">
            <tp-header :header="child" :cur_header="cur_header" @choose-header="$emit('choose-header',$event)"></tp-header>
        </li>
    </ul>`
});
Vue.component('tp-content', {
    props: ['blog'],
    data: function () {
        return {
            content: "",
            renderer: new marked.Renderer()
        }
    },
    watch: {
        blog: function (val) {
            var vm = this
            $.LoadingOverlay("show")
            $.getJSON(val.url, function (data) {
                if (val.type == "blob") {
                    vm.content = new Base64().decode(data.content)
                } else {
                    vm.content = data
                }
                $.LoadingOverlay("hide")
            })
        },
        outline: function (val) {
            this.$emit('outline-change', val)
        }
    },
    computed: {
        content_html: function () {
            if (this.content) {
                var content_html = marked(this.content, { renderer: this.renderer })
                return content_html
            }
        },
        outline: function () {
            var outline = []
            var headers = $(`<div>${this.content_html}</div>`).find(":header")
            var stack = []
            var current_header = function () {
                var current = outline
                $.each(stack, function (i, d) {
                    current = i > 0 ? current.children[d] : current[d]
                })
                return current
            }
            var prev_header = function () {
                var current = outline
                for (var i = 0; i < stack.length - 1; i++) {
                    var d = stack[i]
                    current = i > 0 ? current.children[d] : current[d]
                }
                return current
            }
            var header_level = function (header) {
                return parseInt(header.tagName.replace(/[^\d]+/, ""))
            }
            $.each(headers, function (i, header) {
                header = {
                    name: $(header).text(),
                    id: $(header).attr("id"),
                    level: header_level(header),
                    children: []
                }
                while (true) {
                    if (current_header().level) {
                        if (header.level > current_header().level) {
                            current_header().children.push(header)
                            stack.push(0)
                            break;
                        }
                        if (prev_header().level && header.level == current_header().level) {
                            prev_header().children.push(header)
                            stack[stack.length - 1] = stack[stack.length - 1] + 1
                            break;
                        } else {
                            stack.pop()
                        }
                    } else {
                        current_header().push(header)
                        stack.push(current_header().length - 1)
                        break
                    }
                }
            })
            return outline;
        }
    },
    created: function () {
        this.renderer.heading = function (text, level) {
            return `<h${level} id="${guid()}">${text}</h${level}>`;
        };
    },
    template: `<div id="markdown-html" v-html="content_html"></div>`
});