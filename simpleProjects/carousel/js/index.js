window.addEventListener('DOMContentLoaded', function () {
    var focus = document.querySelector('.focus')
    var focusWidth = focus.offsetWidth
    var prev = document.querySelector('.prev')
    var next = document.querySelector('.next')
    // 1. 鼠标经过轮播,显示/隐藏左右翻页按钮,(7.1)开启/关闭定时器
    focus.addEventListener('mouseenter', function () {
        prev.style.display = 'block'
        next.style.display = 'block'
        // 7.1
        clearInterval(timer)
        timer = null
    })
    focus.addEventListener('mouseleave', function () {
        prev.style.display = 'none'
        next.style.display = 'none'
        // 7.1
        timer = setInterval(function () {
            next.click()
        }, 1500)

    })
    // 2. 动态生成页码(底部小圆圈),其数量与轮播图数量保持一致
    var ul = focus.querySelector('ul')
    var ol = focus.querySelector('.circle')
    for (var i = 0; i < ul.children.length; i++) {
        var li = document.createElement('li')
        li.setAttribute('index', i)
        ol.appendChild(li)
        // 3. 绑定页码的点击事件,与轮播图位置保持一致
        li.addEventListener('click', function () {
            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = ''
            }
            this.className = 'current'
            var index = this.getAttribute('index')
            // 6. 修复轮播图滚动和页码当前状态顺序混乱,需始终同步它们的值
            num = circle = index 
            animate(ul, - focusWidth * index)
        })
    }
    // 设置当前页码为第一张轮播图
    ol.children[0].className = 'current'
    // console.log(ul.children.length) === 4
    // 4. 克隆第一张轮播图到结构最后面,实现无缝滚动
    var first = ul.children[0].cloneNode(true)
    ul.appendChild(first)
    // console.log(ul.children.length) === 5

    // 5. 实现点击左右按钮翻页功能
    /**
     * num: 控制图片滚动
     * circle: 控制页码位置当前状态
     */
    var num = 0
    var circle = 0
    // 8. 优化: 节流阀
    var flag = true
    next.addEventListener('click', function () {
        if (flag) {
            flag = false    // 关闭节流阀
            if (num === ul.children.length - 1) {
                // 无缝滚动
                ul.style.left = 0
                num = 0
            }
            num++
            animate(ul, - focusWidth * num, function () {
                flag = true // 开启节流阀
            })
            circle++
            if (circle === ol.children.length) {
                circle = 0
            }
            
            // for (var i = 0; i < ol.children.length; i++) {
            //     ol.children[i].className = ''
            // }
            // ol.children[circle].className = 'current'
            circleChange()
        }
    })
    prev.addEventListener('click', function () {
        if (flag) {
            flag = !flag    // 关闭节流阀
            if (num === 0) {
                num = ul.children.length - 1
                ul.style.left = - num * focusWidth + 'px'
            }
            num--
            animate(ul, - focusWidth * num, function () {
                flag = !flag     // 开启节流阀
            })
            circle--
            if (circle < 0) {
                circle = ol.children.length - 1
            }
            
            // for (var i = 0; i < ol.children.length; i++) {
            //     ol.children[i].className = ''
            // }
            // ol.children[circle].className = 'current'
            circleChange()
        }
    })

    function circleChange() {
        for (var i = 0; i < ol.children.length; i++) {
            ol.children[i].className = ''
        }
        ol.children[circle].className = 'current'
    }

    // 7. 自动轮播
    var timer = setInterval(function () {
                    next.click()
                }, 1500)

    
    // 8. 优化
    /**
     * 轮播优化(节流阀):
     *      BUG描述:连续点击翻页按钮时轮播速度过快
     *      BUG解决思路: 当上一个动画函数执行完毕后,才执行下一个动画,使事件无法连续触发
     *      设置临时变量flag,当动画执行完毕后,手动控制回调里的flag值
     */
})