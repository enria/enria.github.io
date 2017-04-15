/**
 * Created by zhangyd on 2017/4/10.
 */
Vue.directive("markdown",function (el,binding) {
    el.innerHTML=marked(binding.value)
})
