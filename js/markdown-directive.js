/**
 * Created by zhangyd on 2017/4/10.
 */
Vue.directive("markdown",function (el,binding) {

    var renderer = new marked.Renderer();

    renderer.image = function (href,title, text) {
        if(text.indexOf("svg")>=0&&href.indexOf("svg")>=0){

            return  '<div class="panel panel-default" style="width: 66%"><div class="panel-body"><svg data-url="'+href+'"></svg></div></div>'
        }
        else
            return '<div class="panel panel-default" style="width: 66%"><div class="panel-body"><image class="img-responsive" src="'+href+'"/></div></div>'
    }
    el.innerHTML=marked(binding.value,{renderer:renderer})
    var svgs=$(el).find("svg")
    console.log(svgs)


    for(var i=0;i<svgs.length;i++){
        var svg=$(svgs[i])
        var url=svg.attr("data-url")
        svg.load(url, function () {
            var s=$(this).find("svg")[0]
            console.log($(s))
            var width = s.width.baseVal.value
            var height = s.height.baseVal.value
            var Options = {
                events: {
                    mouseWheel: true,
                    doubleClick: true,
                    drag: true,
                    dragCursor: "move"
                },
                animationTime: 300,
                zoomFactor: 0.25,
                maxZoom: 3,
                panFactor: 100,
                initialViewBox: {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height
                },
                limits: {
                    x: -width / 2,
                    y: -height / 2,
                    x2: width / 2 * 3,
                    y2: height / 2 * 3
                }
            }
            $(this).svgPanZoom(Options)
        })
    }
})
