// v2.0 重构版

var params = {
    turnNum: 8, //初始化圈数
    turnRate: '2.6s',   // //转盘滚动过渡时间
    table: document.querySelector('.container'),
    judgeFn: judgeFn
}

// 判断奖项(该函数写在params对象里是为了方便后期修改与配置,其他属性同理)
function judgeFn(deg) {    
    switch (true) {
        case deg > 1 && deg < 52:
            alert('恭喜抽中一等奖')
            break;
        case deg > 52 && deg < 104:
            alert('恭喜抽中二等奖')
            break;
        case deg > 104 && deg < 156:
            alert('恭喜抽中三等奖')
            break;
        case deg > 156 && deg < 208:
            alert('恭喜抽中四等奖')
            break;
        case deg > 208 && deg < 260:
            alert('恭喜抽中五等奖')
            break;
        case deg > 260 && deg < 312:
            alert('恭喜抽中六等奖')
            break;
        default:
            alert('谢谢参与')       
    }
} 

// new Lottery(params)
var lottery = new Lottery(params)
console.log(lottery)






























// v1.0糟粕版
/* (function () {
    var pan = document.querySelector('.pan'),
        btn = document.querySelector('.btn')
    // 转盘锁(防止用户连续点击)
    var flag = true
    // 旋转度数(随机)
    var num = 0 
    btn.addEventListener('click', function () {
        if (flag) {
            num = Math.floor(Math.random() * 360)
            console.log(num)
            turnPan(num)
            flag = !flag
        }
    })

    // 旋转转盘
    function turnPan(deg) {
        var deg = deg + 360 * 8   //初始化圈数
        pan.style.transform = `rotate(${deg}deg)`
        pan.style.transition = 'all 2.6s'
    }

    // 过渡效果完成后,解锁&&显示奖项
    pan.addEventListener('webkitTransitionEnd', function() {
        console.log('transition has been end this time')
        // 解锁
        flag = true
        // 转盘归位
        pan.style.transform = `rotate(${num}deg)`
        pan.style.transition = 'none'
        judge(num)
    })

    // 判断奖项
    function judge(deg) {    
        switch (true) {
            case deg > 1 && deg < 52:
                alert('恭喜抽中一等奖')
                break;
            case deg > 52 && deg < 104:
                alert('恭喜抽中二等奖')
                break;
            case deg > 104 && deg < 156:
                alert('恭喜抽中三等奖')
                break;
            case deg > 156 && deg < 208:
                alert('恭喜抽中四等奖')
                break;
            case deg > 208 && deg < 260:
                alert('恭喜抽中五等奖')
                break;
            case deg > 260 && deg < 312:
                alert('恭喜抽中六等奖')
                break;
            default:
                alert('谢谢参与')       
        }
    } 
}()) */