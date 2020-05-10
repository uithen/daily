var self

class Tab {
    constructor(id) {
        self = this
        this.main = document.querySelector(id)
        this.add = this.main.querySelector('.tabadd')
        this.ul = this.main.querySelector('.firstnav ul:first-child')
        this.con = this.main.querySelector('.tabscon')
        this.init()
    }

    updateNode() {
        this.lis = this.main.querySelectorAll('li')
        this.sections = this.main.querySelectorAll('section')
        this.remove = this.main.querySelectorAll('.icon-guanbi')
        this.spans = this.main.querySelectorAll('.firstnav li span:first-child')
    }

    init() {
        this.updateNode()
        this.add.addEventListener('click', this.addTab)
        for (var i = 0; i < this.lis.length; i++) {
            this.lis[i].index = i 
            this.lis[i].addEventListener('click', this.toggleTab)
            this.remove[i].addEventListener('click', this.removeTab)
            this.spans[i].addEventListener('dblclick', this.editTab)
            this.sections[i].addEventListener('dblclick', this.editTab)
        } 
    }

    // 1. 切换
    toggleTab() {
        self.clearCls()
        this.className = 'liactive'
        self.sections[this.index].className = 'conactive'
    }

    // 2. 添加
    addTab() {
        self.clearCls()
        var rand = Math.random().toFixed(3)
        var li = '<li class="liactive"><span>new tab</span><span class="iconfont icon-guanbi"></span></li>'
        var section = '<section class="conactive">双击标题或内容区可编辑'+ rand +'</section>'
        self.ul.insertAdjacentHTML('beforeend', li)
        self.con.insertAdjacentHTML('beforeend', section) 
        self.init()
    }

    // 3. 删除
    removeTab(e) {
        e.stopPropagation()
        var index = this.parentNode.index 
        self.lis[index].remove()
        self.sections[index].remove()
        self.init()

        // 在一个tab选中时删除某个其他tab时,选中状态保持不变
        if (document.querySelector('.liactive')) return 
        // 选中状态位于最后一个tab并且删除该tab时,选中状态应自动顺位到前一个tab
        index--
        self.lis[index] && self.lis[index].click()

    }
    // 4. 修改
    editTab(e) {
        // 取消默认双击选定文字
        window.getSelection
        ? window.getSelection().removeAllRanges()
        : document.selection.empty()
        var txtValue = this.innerHTML 
        this.innerHTML = '<input type="text" />'
        var input = this.children[0]
        input.value = txtValue
        input.select() 

        input.addEventListener('blur', function () {
            this.parentNode.innerHTML = this.value
        })

        input.addEventListener('keyup', function (e) {
            if (e.keyCode === 13) {
                this.blur()
            }
        })
    }

    // 清除类名
    clearCls() {
        for (var i = 0; i < this.lis.length; i++) {
            this.lis[i].className = ''
            this.sections[i].className = ''
        }
    }

}

new Tab('#tab')