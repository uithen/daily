window.addEventListener('DOMContentLoaded', function () {
    // 手机号
    var regtel = /^1[3|4|5|6|7|8]\d{9}$/
    // qq:10000开始5到11位纯数字
    var regqq = /^[1-9]\d{4,10}$/
    // 用户名:二到十位汉字
    var regnick = /^[\u4e00-\u9fa5]{2,10}$/
    // 短信验证码
    var regmsg = /^\d{6}$/
    // 密码(待完善)
    var regpwd = /^\d{6}$/

    var tel = document.querySelector('#tel')
    var qq = document.querySelector('#qq')
    var nick = document.querySelector('#nick')
    var msg = document.querySelector('#msg')
    var pwd = document.querySelector('#pwd')
    var surepwd = document.querySelector('#surepwd')

    
    regexp(tel, regtel)
    regexp(qq, regqq)
    regexp(nick, regnick)
    regexp(msg, regmsg)
    regexp(pwd, regpwd)

    // 表单字符段验证
    function regexp(elem, reg) {
        elem.addEventListener('blur', function () {
            if (reg.test(this.value)) {
                this.nextElementSibling.className = 'success'
                this.nextElementSibling.innerHTML = '<i class="success_icon"></i> 输入正确'
            } else {
                this.nextElementSibling.className = 'error'
                this.nextElementSibling.innerHTML = '<i class="error_icon"></i> 格式有误，请重新输入'
            }
        })
    }

    // 确认密码
    surepwd.addEventListener('blur', function () {
        if (this.value === pwd.value && pwd.value !== '') {
            this.nextElementSibling.className = 'success'
            this.nextElementSibling.innerHTML = '<i class="success_icon"></i> 输入正确，两次密码一致'
        } else {
            this.nextElementSibling.className = 'error'
            this.nextElementSibling.innerHTML = '<i class="error_icon"></i> 两次密码不一致，请重新输入'
        }
    })
})