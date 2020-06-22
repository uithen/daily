(function () {
    var imgShow = document.getElementById('imgData'),
        prev = document.getElementById('prev'),
        next = document.querySelector('#next'),
        runNum = document.querySelector('#runNum'),
        circulate = document.querySelector('.circulate'),
        acyclic = document.querySelector('.acyclic'),
        btns = document.getElementsByClassName('btns')[0]
    // 图片数据
    var imgArr = [
        './images/showImg01.jpg',
        './images/showImg02.jpg',
        './images/showImg03.jpg',
        './images/showImg04.jpg',
        './images/showImg05.jpg'
    ]

// ---------------------------------------------------------

    // v2.0 优化版(面向对象)
    function TurnImg(arr) {
        this.len = arr.length - 1
    }

    TurnImg.prototype = {
        constructor: TurnImg,
        index: 0,
        flag: false,
        prevIndex: function () {
            this.index--
            if (this.flag) {
                this.index = this.index < 0 ? this.len : this.index 
            } else {
                this.index = this.index < 0 ? 0 : this.index
            }
            return this.index
        },
        nextIndex: function () {
            this.index++
            if (this.flag) {
                this.index = this.index > this.len ? 0 : this.index
            } else {
                this.index = this.index > this.len ? this.len : this.index 
            }
            // return this.index
        }
    }

    var t = new TurnImg(imgArr)
    console.log(t)

    // 图片左右切换
    prev.addEventListener('click', function() {
        var num = t.prevIndex()
        imgShow.src = imgArr[num]
        runNum.innerHTML = `${num + 1}/${imgArr.length}`
        
    })

    next.addEventListener('click', function() {
        // var num = t.nextIndex()
        t.nextIndex()
        console.log(t.index)
        imgShow.src = imgArr[t.index]
        runNum.innerHTML = `${t.index + 1}/${imgArr.length}`
    })

    // 循环/非循环控制
    btns.addEventListener('click', function(e) {
        console.log(e.target)
        if (e.target.className === 'circulate') {//循环
            console.log(this)
            t.flag = true 
            this.querySelector('.circulate').style.background = 'green'
            this.querySelector('.acyclic').style.background = 'red'
        } else  if (e.target.className === 'acyclic') {// 不循环
            t.flag = false 
            this.querySelector('.circulate').style.background = 'red'
            this.querySelector('.acyclic').style.background = 'green'
        }
    })


// ---------------------------------------------------------

    // v1.0 非优化版
        // var len = imgArr.length - 1
        // var index = 0
        // var flag = true // 循环锁
        // circulate.addEventListener('click', function () {
        //     flag = true 
        // })
        // acyclic.addEventListener('click', function () {
        //     flag = false
        // })
        // prev.addEventListener('click', function () {
        //     index--
        //     if (flag) { // 循环
        //         index = index < 0 ? len : index
        //     } else {    // 不循环
        //         index = index < 0 ? 0 :index
        //     }
        //     imgShow.src = imgArr[index]
        //     runNum.innerText = `${index + 1}/5`
        // })
        // next.addEventListener('click', function () {
        //     index++
        //     if (flag) {
        //         index = index > len ? 0 : index
        //     } else {
        //         index = index > len ? len : index 
        //     }
        //     imgShow.src = imgArr[index]
        //     runNum.innerText = `${index + 1}/5`
        // })
}())