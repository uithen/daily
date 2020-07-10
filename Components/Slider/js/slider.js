/**
 * 轮播组件功能实现：
 *      - 滚动内容垂直居中
 *      - 支持无限张图片
 *      - 支持前后翻动
 *      - 支持拖拽滚动
 *      - 可直接定位
 *
 * 尝试使用数据驱动的UI开发:
 *      -------------------
 *      |     |     |     |  <- 只有三栏是常驻的
 * -------------------------------
 * |    |     |     |     |      |
 * |    |     |     |     |      |
 * |    |  1  |  2  |  3  |      |
 * |    |     |     |     |      |
 * |    |     |     |     |      |
 * |    |     |     |     |      |
 * -------------------------------
 *      |     |     |     |
 *      -------------------
 */

;(function (_) {
	// html转node
	function html2node(str) {
		var elem = document.createElement('div')
		elem.innerHTML = str
		return elem.children[0]
	}

	// 考虑到组件的通用性,此处没有将img耦合到结构里
	var template = `
        <div class="m-slider">
            <div class="slide"></div>
            <div class="slide"></div>
            <div class="slide"></div>
        </div>
    `

	// Slider
	function Slider(opt) {
		_.extend(this, opt) // push实例属性
		// 容器节点
		this.container = this.container || document.body
		this.container.style.overflow = 'hidden' // 设置hidden防止动画时出现滚动条
		// 组件节点
		this.slider = this._layout.cloneNode(true) // 滚动带,clone保证每个组件实例的唯一性
		this.slides = [].slice.call(this.slider.querySelectorAll('.slide')) // 常驻的三张轮播节点
		// 拖拽相关
		this.offsetWidth = this.container.offsetWidth
		this.breakPoint = this.offsetWidth / 4
		this.pageNum = this.images.length // 读取并保存图片数量
		// 内部数据结构(图片滚动依赖的三个数据)
		this.slideIndex = 1 // slide下标,当前视口所处位置[0-2]
		this.pageIndex = this.pageIndex || 0 // img当前下标[0-pageNum]
		this.offsetAll = this.pageIndex // 容器(.m-slider)的偏移下标
		this.container.appendChild(this.slider)
		// 拖拽切换开关
		if (this.drag) this._initDrag()
	}
    // 添加自定义事件系统
    // 不采用事件方式的话,就必须依赖于手动传入回调的方式来对后续逻辑做处理.好处在于可以与组件本身逻辑耦合还可以支持多回调逻辑和动态的绑定与解绑
	_.extend(Slider.prototype, _.emitter)
	// push原型属性
	_.extend(Slider.prototype, {
		_layout: html2node(template),
		// 直接跳转到指定页
		nav: function (pageIndex) {
			this.pageIndex = pageIndex
			this.slideIndex =
				typeof this.slideIndex === 'number'
					? this.slideIndex
					: (pageIndex + 1) % 3
			this.offsetAll = pageIndex

			this.slider.style.transitionDuration = '0s' // 直接定位时,取消动画

			this._calcSlide()
		},
		// 下一页
		next: function () {
			this._step(1)
		},
		// 上一页
		prev: function () {
			this._step(-1)
		},
		// 单步移动
		_step: function (offset) {
			this.offsetAll += offset
			this.pageIndex += offset
			this.slideIndex += offset
			this.slider.style.transitionDuration = '.5s'

			this._calcSlide()
		},
		// 计算Slide
		// 每个slide的left = (offsetAll + offset(1, -1)) * 100%
		// 外层容器 (.m-slider) 的偏移 = offsetAll * 宽度
		_calcSlide: function () {
			//
			var slideIndex = (this.slideIndex = this._normIndex(this.slideIndex, 3))
			var pageIndex = (this.pageIndex = this._normIndex(
				this.pageIndex,
				this.pageNum
			))
			var offsetAll = this.offsetAll
			var pageNum = this.pageNum

			var prevSlideIndex = this._normIndex(slideIndex - 1, 3)
			var nextSlideIndex = this._normIndex(slideIndex + 1, 3)

			var slides = this.slides

			// 三个slide的偏移
			slides[slideIndex].style.left = offsetAll * 100 + '%'
			slides[prevSlideIndex].style.left = (offsetAll - 1) * 100 + '%'
			slides[nextSlideIndex].style.left = (offsetAll + 1) * 100 + '%'

			// 容器偏移 触发硬件加速
			this.slider.style.transform =
				'translateX(' + -offsetAll * 100 + '%) translateZ(0)'

			// 当前slide 添加 'z-active'的className
			slides.forEach(function (node) {
				_.delClass(node, 'z-active')
			})
			_.addClass(slides[slideIndex], 'z-active')

			this._onNav(this.pageIndex, this.slideIndex)
		},
		// 标准化下标
		_normIndex: function (index, len) {
			return (len + index) % len
		},

		// 跳转时完成的逻辑，这里是设置图片的url
		_onNav: function (pageIndex, slideIndex) {
			var slides = this.slides

			for (var i = -1; i <= 1; i++) {
				var index = (slideIndex + i + 3) % 3
				var img = slides[index].querySelector('img')
				if (!img) {
					img = document.createElement('img')
					slides[index].appendChild(img)
				}
				img.src =
					'./images/pic0' +
					(this._normIndex(pageIndex + i, this.pageNum) + 1) +
					'.jpg'
			}

			this.emit('nav', {
				pageIndex: pageIndex,
				slideIndex: slideIndex,
			})
		},

		//   // 拖动相关
		_initDrag: function () {
			this._dragInfo = {}
			this.slider.addEventListener('mousedown', this._dragstart.bind(this))
			this.slider.addEventListener('mousemove', this._dragmove.bind(this))
			this.slider.addEventListener('mouseup', this._dragend.bind(this))
			// 鼠标移出容器节点时,会触发leave事件,导致鼠标一直处于move状态,_dragend一下就好了
			this.slider.addEventListener('mouseleave', this._dragend.bind(this))
		},

		_dragstart: function (ev) {
			var dragInfo = this._dragInfo
			dragInfo.start = { x: ev.pageX, y: ev.pageY }
		},

		_dragmove: function (ev) {
			var dragInfo = this._dragInfo
			// 如果还没有开始拖拽则退出
			if (!dragInfo.start) return

			ev.preventDefault()
			this.slider.style.transitionDuration = '0s'

			var start = dragInfo.start
			// 清除恼人的选区,文本内容的
			if (window.getSelection) {
				window.getSelection().removeAllRanges()
			} else if (window.document.selection) {
				window.document.selection.empty()
			}

			this.slider.style.transform =
				'translateX(' +
				-(this.offsetWidth * this.offsetAll - ev.pageX + start.x) +
				'px) translateZ(0)'
		},

		_dragend: function (ev) {
			var dragInfo = this._dragInfo
			if (!dragInfo.start) return

			ev.preventDefault()
			var start = dragInfo.start
			this._dragInfo = {}
			var pageX = ev.pageX

			// 看走了多少距离
			var deltX = pageX - start.x
			if (Math.abs(deltX) > this.breakPoint) {
				this._step(deltX > 0 ? -1 : 1)
			} else {
				this._step(0)
			}
		},
	})

	window.Slider = Slider
})(util)
