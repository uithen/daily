/**
 * options: 翻页器选项配置
 *      curPage: 设置当前页码
 *      callPage: 设置当前翻页器的总页码数
 *      wrap: 设置翻页器插入接口
 *      turnPageShowData: 切换页码时的回调函数
 * 本翻页器页码排列说明:
 *      收缩页码(即显示为省略号...的页码)排列:
 *          1. 根据当前页(curPage)位置,判断左右两侧是否都至少有两个页码
 *          2. 在1的基础上,再判断左右两侧页码与页码1和总页码之间是否包含2个页码数之上才显示收缩页码...
 *      普通(数字)页码排列:
 *          1. 第一页和最后一页始终显示
 *          2. 若当前页码处于第一页或最后一页时,前者不显示上一页,后者不显示下一页
 *          3. 当前页码左右两侧的页码数量为2,即中间页码的排列显示数量始终为5(除去第二页和倒数第二页的情况)
 */

function PageTurner(options) {
    this.curPage = options.curPage || 2
    this.allPage = options.allPage || 6
    this.wrap = options.wrap || document.body
    this.turnPageShowData = options.turnPageShowData
}
// 初始化
PageTurner.prototype.init = function () {
    this.fillHTML()
    this.addEvent()
}

// 翻页器结构填充
PageTurner.prototype.fillHTML = function () {
    this.wrap.innerHTML = ''
    var pageTurnerWrapper = document.createElement('ul')
    pageTurnerWrapper.className = 'page-turner-wrapper'
    // 上一页按钮
    var prevBtn = document.createElement('li')
    if (this.curPage > 1) {
        prevBtn.innerText = '上一页'
        prevBtn.className = 'prevBtn'
        pageTurnerWrapper.appendChild(prevBtn)
    }
    // 第一页
    var firstLi = document.createElement('li')
    firstLi.innerText = 1
    firstLi.className = 'num'
    pageTurnerWrapper.appendChild(firstLi)
    this.addCurCls(firstLi, 1)

    // 左侧收缩页码
    if (this.curPage - 2 > 2) {
        var span = document.createElement('span')
        span.innerText = '...'
        pageTurnerWrapper.appendChild(span)       
    }
    // 中间页码
    for (var i = this.curPage - 2; i <= this.curPage + 2; i++) {
        // 第一页和最后一页已经创建过,所以这里不用加等号,避免二次渲染
        if (i > 1 && i < this.allPage) {
            var pageLi = document.createElement('li')
            pageLi.innerText = i
            pageLi.className = 'num'
            this.addCurCls(pageLi, i)
            pageTurnerWrapper.appendChild(pageLi)    
        }
    }
    // 右侧收缩页码
    if (this.curPage + 2 < this.allPage - 1) {
        var span = document.createElement('span')
        span.innerText = '...'
        pageTurnerWrapper.appendChild(span)       
    }    
    // 最后一页
    if (this.allPage > 1) {
        var lastLi = document.createElement('li')
        lastLi.innerText = this.allPage
        lastLi.className = 'num'
        this.addCurCls(lastLi, this.allPage)
        pageTurnerWrapper.appendChild(lastLi)
    }

    // 下一页按钮
    if (this.curPage < this.allPage) {
        var nextBtn = document.createElement('li')
        nextBtn.innerText = '下一页'
        nextBtn.className = 'nextBtn'
        pageTurnerWrapper.appendChild(nextBtn)
    }
    
    this.wrap.appendChild(pageTurnerWrapper)
}

// 当前页码添加高亮
PageTurner.prototype.addCurCls = function (elem, pageNum) {
    if (this.curPage === pageNum) {
        elem.classList.add('curPage')
    }
}

// 添加翻页事件
PageTurner.prototype.addEvent = function () {
    this.wrap.addEventListener('click', (e) => {
        var targetDom = e.target,
            turnBtn = targetDom.classList.value.includes('Btn'),
            numBtn = targetDom.classList.contains('num')
        // 上/下一页逻辑
        if (turnBtn) {
            var prev = targetDom.classList.contains('prevBtn')
            prev ? this.curPage-- : this.curPage++
            this.fillHTML()
            // 回调处理
            this.turnPageShowData(this.curPage)
            // console.log(this.curPage)
        } else if (numBtn) {
            // 点击数字页码
            this.curPage = parseInt(targetDom.innerText)
            this.addCurCls(targetDom, this.curPage)
            this.fillHTML()
            // 回调处理
            this.turnPageShowData(this.curPage)
        }
        
    })
}