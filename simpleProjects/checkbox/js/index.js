(function(){
    
    var li = document.querySelectorAll('li'),
        ipt = document.querySelectorAll('ul li input'),
        checkAll = document.querySelector('#checkAll'),
        invert = document.querySelector('#invert')

    var colorArr = ['#ffb6b6', '#fde2e2', '#aacfcf']

    // 背景渐变
    for (var i = 0; i < li.length; i++) {
        li[i].style.backgroundColor = colorArr[i % colorArr.length]
        li[i].addEventListener('click', clickFn)    //注册点击事件
    }

    function clickFn(e) {        
        if (e.target.tagName === 'INPUT' && e.target.checked === false) {
            checkAll.checked = false
        } else {
            var count = 0
            for (var i = 0; i < ipt.length; i++) {
                if (ipt[i].checked) {
                    count++
                }
            }
            if (count === ipt.length) {
                checkAll.checked = true 
            }  
        }
    }

    // 全选/全不选
    checkAll.addEventListener('click', function() {
        if (this.checked) {
            for (var i = 0; i < ipt.length; i++) {
                ipt[i].checked = true
            }            
        }else {
            for (var i = 0; i < ipt.length; i++) {
                ipt[i].checked = false
            } 
        }
    })

    // 反选
    invert.addEventListener('click', function() {
        var checkedNum = 0
        var uncheckedNum = 0
        for (var i = 0; i < ipt.length; i++) {
            if (ipt[i].checked) {
                ipt[i].checked = false
                // 记录选中的个数
                checkedNum++
            } else {
                ipt[i].checked = true
                // 记录未选中的个数
                uncheckedNum++
            }
        }
        // 当选中的个数为全选时,点击反选后,勾掉全选按钮
        if (checkedNum === ipt.length) {
            checkAll.checked = false 
        } else if (uncheckedNum === ipt.length) { // 当个数为都未选中时,点击反选后,勾上全选按钮
            checkAll.checked = true
        }
    })

}())