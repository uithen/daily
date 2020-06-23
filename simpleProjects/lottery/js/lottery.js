    // v2.0 重构版
(function (win) {
    // 默认配置
    var defaultParams = {
        turnNum: 3,
        turnRate: '4s',
        table: document.querySelector('body'),
        judgeFn: function () {
            alert('未传入参数,不能进行抽奖')
        }
    }

    // 暴露接口
    win.Lottery = Lottery 

    function Lottery(params) {
        this.params = Object.assign(defaultParams, params)
        console.log(this.params)
        // this.num = 0,
        this.flag = true
        this.init()
    }

    // 初始化
    Lottery.prototype.init = function() {
        var btn = this.params.table.querySelector('.btn')
        this.pan = this.params.table.querySelector('.pan')
        this.num = 0
        var self = this; 
        btn.addEventListener('click', function() {
            if (self.flag) {
                self.num = Math.floor(Math.random() * 360)
                self.turnPan(self.num)
                self.flag = false
            }
        })
        // 过渡效果完成后,解锁&&显示奖项
        this.pan.addEventListener('webkitTransitionEnd', function() {
            self.flag = true
            this.style.transform = `rotate(${self.num}deg)`
            this.style.transition = 'none'
            self.params.judgeFn(self.num)
        })
    }

    // 滚动转盘
    Lottery.prototype.turnPan = function(deg) {
        deg += 360 * this.params.turnNum
        this.pan.style.transform = `rotate(${deg}deg)`
        this.pan.style.transition = `all ${this.params.turnRate}`
    }
    
}(window))