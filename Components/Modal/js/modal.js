(function () {
    // 辅助函数
    // -------

    // 将HTML转换为节点
    function html2node(str) {
        var container = document.createElement('div')
        container.innerHTML = str 
        return container.children[0]  //将下列template字符串转换为node
    }
    // 拓展属性(用于往原型上添加属性)
    // extend: {x:1},{a:1, b:2} ==> {x:1,a:1,b:2},注意不是覆盖,跟assign不一样!
    function extend(o1, o2) {
        for (var p in o2) if (typeof o1[p] === 'undefined') {
            o1[p] = o2[p]
        }
        return o1 
    }
    // 结构
    var template = `
        <div class="m-modal">
            <div class="modal_align"></div>
            <div class="modal_wrap animated">
                <div class="modal_head">标题</div>
                <div class="modal_body">内容</div>
                <div class="modal_foot">
                    <a href="#" class="confirm">确认</a>
                    <a href="#" class="cancel">取消</a>
                </div>
            </div>
        </div>
    `

    // Modal主逻辑
    // -----

    function Modal(options) {
        options = options || {}
        // 由于_layout设置在了原型上的,会导致所有实例共享,所以在这初始化的时候做了克隆处理,以保证每个实例拥有自己的container
        this.container =  this._layout.cloneNode(true)
        //缓存节点(将后续会频繁使用到的节点放在实例属性上,属于性能优化...)
        this.body = this.container.querySelector('.modal_body') 
        this.wrap = this.container.querySelector('.modal_wrap') 

        // 拓展实例属性
        extend(this, options)

        this._initEvent()
    }

    // 拓展原型属性
    extend(Modal.prototype, {
        // modal结构渲染
        _layout: html2node(template),
        // modal内容区配置,支持传入字符串和DOM节点两种格式
        setContent(content) {
            if (!content) {
                return
            }
            if (content.nodeType === 1) {
                this.body.innerHTML = ''
                this.body.appendChild(content)
            } else {
                this.body.innerHTML = content
            }
        },
        // 显示弹窗
        show(content) {
            if (content) {
                this.setContent(content)
            }
            document.body.appendChild(this.container)
            // 优化1:添加动画(需要手动往模板里的wrap添加animated类)
            animateClass(this.wrap, this.animation.enter)
        },
        // 隐藏弹窗
        hide() {
            // 移除节点必须写在回调里,如果写在添加动画之后,由于动画有延迟,也就是说动画还未开始时,节点就已经移除了,也就无法看到效果了
            animateClass(this.wrap, this.animation.leave, () => {
                document.body.removeChild(this.container)
            })
        },
        // 初始化事件
        _initEvent() {
            this.container.querySelector('.confirm').addEventListener('click', this._onConfirm.bind(this))
            this.container.querySelector('.cancel').addEventListener('click', this._onCancel.bind(this))
        },
        _onConfirm() {
            // 优化2: 使用事件系统
            this.emit('confirm')
            // this.onConfirm() 不用像这样显示的传入了
            this.hide()
        },
        _onCancel() {
            this.emit('cancel')
            // this.onCancel()
            this.hide()
        }
    })

    // 使用混入Mixin的方式使得Slider具有事件发射器功能
    // 提供一个事件系统的优点在于可以减小我们内部配置参数的压力,不需要再用到一个事件类型再去内部一个个手动添加传入
    extend(Modal.prototype, emitter);

    // Exports
    // -------

    // 暴露API: Amd || Commonjs || Global

    // 支持CommonJS
    if(typeof exports === 'object') {
        module.exports = Modal
        // 支持Amd
    } else if(typeof define === 'function' && define.amd) {
        define(function() {
            return Modal
        })
    } else {
        // 直接暴露到全局
        window.Modal = Modal
    }

}())