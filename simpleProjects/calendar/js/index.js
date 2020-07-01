/**
 * 整体思路:
 *  1. 巧用原生JS的Date对象的[自动拓展]特性,如(new Date(2020,2,0)可返回2月的最后一天)
 *  2. 使所用到的年、月、日、天数等需要操作的数据一律保存为日期对象或日期对象能操作到的形式
 *  3. 在步骤1、2基础上操作日期对象完成对日历的自动排版(正确显示)
*/

var calendar = {
    weeks: ['日', '一', '二', '三', '四', '五', '六'],
    // showDate: {
    //     year: 0,
    //     month: 0,
    //     day: 0
    // },
    date: new Date(),
    showPanel: false, // 面板开关

    init(options) {
        this.initData(options)
        this.render()
        this.handle()
    },

    initData(options) {
        this.elem = options.elem
        this.getDate = options.getDate 
        // 面板展示日期
        this.showDate = this.setYearMonthDay(this.date)
        this.showDays = this.setShowDays()
        this.chooseDay = this.setChooseDay(this.showDate)
    },

    render() {
        this.elem.innerHTML = this.renderCalendarHead() + this.renderCalendarBody()
        console.log('render')
    },
    renderCalendarHead() {
        return `
            <div class="picker-input">
                <span class="picker-prefix"></span>
                <input type="text" value="${this.chooseDay}">
            </div>
        `
    },
    renderCalendarBody() {
        return `
            <div class="calendar" style="display:${this.showPanel ? 'block' : 'none'}">
                <div class="header">
                    <span class="picker-btn picker-prev-year"></span>
                    <span class="picker-btn picker-prev-month"></span>
                    <span class="picker-date">${this.showDate.year} 年 ${this.showDate.month + 1} 月</span>
                    <span class="picker-btn picker-next-month"></span>
                    <span class="picker-btn picker-next-year"></span>
                </div>
                <div class="content">
                    <div class="picker-weeks"> ${this.renderWeeks()} </div>
                    <div class="picker-days"> ${this.renderDays()} </div>
                </div>
            </div>
        `
    },
    renderWeeks() {
        var template = ''
        for (var i = 0; i < 7; i++) {
            template += `<div> ${this.weeks[i]} </div>`
        }
        return template
    },
    renderDays() {
        var template = ''
        for (var i = 0; i < 42; i++) {
            var showDays = this.showDays[i],
                isCur = this.isCur(showDays) 
            template += `<div data-index="${i}" class="${isCur.month ? '' : 'other-month'} ${isCur.today ? 'is-today' : '' } ${isCur.choose ? 'is-select' : '' }"> 
                            ${showDays.getDate()} 
                        </div>
            `
        }
        return template
    },

    setYearMonthDay(date) {
        var year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate()
        return {
            year,
            month,
            day 
        }
    },
    setShowDays() {
        var arr = []
        // 此处取当前月的第一天为参照(任何一天都可以,只要把号数和星期能对应上)
        var firstDay = new Date(this.showDate.year, this.showDate.month, 1),
            firstDayWeek = firstDay.getDay(),
            msOfDay = 1 * 24 * 60 * 60 * 1000,
            startDayWeek = +firstDay - firstDayWeek * msOfDay 
        for (var i = 0; i < 42; i++) {
            // 利用Date对象可以自加算日期的特性
            arr[i] = new Date(startDayWeek + msOfDay * i)
        }
        return arr 
    },

    isCur(showDays) {
        // 面板显示日期
        var panelDate = this.setYearMonthDay(showDays),
            panelYear = panelDate.year,
            panelMonth = panelDate.month,
            panelDay = panelDate.day

        // 展示日期(控制除面板当前月的其他月份的天数字体变灰)
        var showDate = this.showDate,
            showYear = showDate.year,
            showMonth = showDate.month

        // 当前日期(控制"今天"高亮显示)
        var todayDate = this.setYearMonthDay(this.date),
            todayYear = todayDate.year,
            todayMonth = todayDate.month,
            todayDay = todayDate.day

        // 选择日期(控制选择高亮显示)
        var chooseDate = this.setYearMonthDay(new Date(this.chooseDay))
            chooseYear = chooseDate.year,
            chooseMonth = chooseDate.month,
            chooseDay = chooseDate.day

        return {
            month: panelYear === showYear && panelMonth === showMonth,
            today: panelYear === todayYear && panelMonth === todayMonth && panelDay === todayDay,
            choose: panelYear === chooseYear && panelMonth === chooseMonth && panelDay === chooseDay
        }
        
    },

    setChooseDay(date) {
        if (date instanceof Date) {
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        }
        return `${date.year}-${date.month + 1}-${date.day}`
    },

    handle() {
        document.addEventListener('click', (e) => {
            var targetDom = e.target, 
                isElemSon = this.elem.contains(targetDom) && targetDom !== this.elem
            // 面板控制开关(click offset)
            if (isElemSon && !this.showPanel) {
                this.changePanel(true)
            } else if (!isElemSon && this.showPanel) {
                this.changePanel(false) 
            }
            // 点击年月日逻辑处理
            if (isElemSon) {
                var isDay = targetDom.parentNode.classList.contains('picker-days')
                var isBtn = targetDom.classList.contains('picker-btn'),
                    isYearBtn = isBtn && targetDom.classList.value.includes('year'),
                    isMonthBtn = isBtn && targetDom.classList.value.includes('month')

                if (isDay) {
                    this.handleDay(targetDom)
                } else if (isYearBtn) {
                    this.handleYear(targetDom)
                } else if (isMonthBtn) {
                    this.handleMonth(targetDom)
                }
            }
        })
    },

    changePanel(status) {
        this.showPanel = status 
        var oPanel = this.elem.querySelector('.calendar')
        oPanel.style.display = status ? 'block' : 'none'
        // this.render()
    },
    handleDay(dom) {
        // 更新chooseDay
        var index = dom.dataset.index,
            chooseDate = this.showDays[index]
        this.chooseDay = this.setChooseDay(chooseDate)
        // 同步面板月份显示
        var month = chooseDate.getMonth()
        if ( month !== this.showDate.month) {
            this.showDate.month = month 
            this.showDays = this.setShowDays()
        }
        // this.showPanel = false 
        this.getDate(this.chooseDay)
        this.render()
    },
    handleYear(dom) {
        // 判断点击的是否是前一年按钮 ? 年份+1 : 年份-1 
        var isPrev = dom.getAttribute('class').includes('prev'),
            moveYear = isPrev ? -1 : 1
        this.showDate.year += moveYear 
        // 同步面板显示年份
        this.showDays = this.setShowDays()
        this.render()
    },
    handleMonth(dom) {
         var isPrev = dom.getAttribute('class').includes('prev'),
         moveMonth = isPrev ? -1 : 1       
        //  记录当前展示日期
         var showDate = new Date(this.showDate.year, this.showDate.month, this.showDate.day)
        // 利用Date对象的setMonth自动更改月份,点击的是否是前一月按钮 ? 月份+1 : 月份-1 
         showDate.setMonth(this.showDate.month + moveMonth)
        //  当跳转到临界月份(1月或12月),更新年份
        this.showDate.year = showDate.getFullYear()
        this.showDate.month = showDate.getMonth() 
        // 同步
        this.showDays = this.setShowDays()
        this.render()
    }
}
console.log(calendar)