(function () {
    // 存储用户所选商品的数据信息
    var selectedData = {}

    // 更新现有的本地存储数据
    function init() {
        selectedData = JSON.parse(localStorage.getItem('cart'))
        createSelectedDom()
    }
    init()

    addEvent()
    function addEvent() {
        var trs = document.querySelectorAll('.product tr')
        for (var i = 0; i < trs.length; i++) {
            action(trs[i], i)
        }

        /**
         * tr: 商品列表的每一行,
         * n: 每一行所对应的索引
        */
        function action(tr, n) {
            // 获取所需元素
            var tds = tr.children,  
                img = tds[0].children[0],   
                imgSrc = img.getAttribute('src'),
                name = tds[1].children[0].innerHTML,
                colors = tds[1].children[1].children,
                priceElem = tds[2],
                price = parseFloat(tds[2].innerHTML),
                subtract = tds[3].querySelectorAll('span')[0],
                add = tds[3].querySelectorAll('span')[1],
                buyNumElem = tds[3].querySelector('strong'),
                buyNum = 0,
                joinBtn = tds[4].children[0]
            
            // 选项卡
            var lastTabElem = null, // 上一个选项卡的类名
                colorValue = '',    // 存储商品颜色
                colorID = ''   // 存储商品ID
            for (var i = 0; i < colors.length; i++) {
                colors[i].index = i 
                colors[i].addEventListener('click', function () {
                    lastTabElem && (lastTabElem.className = '')

                    this.className = 'active'

                    colorValue = this.className ? this.innerHTML : ''
                    colorID = this.className ? this.dataset.id : ''
                    imgSrc = this.className 
                                ? `images/img${n + 1}_${this.index + 1}.jpg`
                                : `images/img${n + 1}_1.jpg`
                    img.src = imgSrc 

                    lastTabElem = this
                })
            }
            
            // 商品购买数量加/减操作
            subtract.addEventListener('click', function () {
                buyNum--
                buyNum = buyNum < 0 ? 0 : buyNum 
                buyNumElem.innerHTML = buyNum
                priceElem.innerHTML = buyNum * price + '.00元'
            })

            add.addEventListener('click', function () {
                buyNum++
                buyNumElem.innerHTML = buyNum
                priceElem.innerHTML = buyNum * price + '.00元'
            })

            // 添加购物车
            joinBtn.addEventListener('click', function () {
                if (!buyNum) {
                    alert('一个不选买空气?')
                    return 
                }
                if (!colorValue) {
                    alert('请选择颜色')
                    return 
                }

                // 单件商品信息
                selectedData[colorID] = {
                    name,
                    buyNum,
                    price,
                    id: colorID,
                    img: imgSrc,
                    color: colorValue,
                    time: new Date().getTime()
                }
                // 设置本地存储
                localStorage.setItem('cart', JSON.stringify(selectedData))

                // 加入购物车后,应当还原商品最初设置
                img.src = `images/img${n + 1}_1.jpg`
                buyNumElem.innerHTML = buyNum = 0
                priceElem.innerHTML = buyNum * price + '.00元'
                lastTabElem.className = ''

                // 渲染本地存储数据
                createSelectedDom()
            })
        }
    }

    function createSelectedDom() {
        var tbody = document.querySelector('.selected tbody'),
            goods = Object.values(selectedData),
            str = ''

        // 最后加入购物车的商品在最前面显示
        goods.sort((a, b) => b.time - a.time)

        tbody.innerHTML = ''
        for (var i = 0; i < goods.length; i++) {
            str +=  `<tr>
                        <td>
                            <img src="${goods[i]['img']}">
                        </td>
                        <td>
                            <p>${goods[i]['name']}</p>
                        </td>
                        <td>${goods[i]['color']}</td>
                        <td>${goods[i]['price'] * goods[i]['buyNum']}.00元</td>
                        <td>X${goods[i]['buyNum']}</td>
                        <td><button data-id = "${goods[i]['id']}">删除</button></td>
                    </tr>`       
        }
        tbody.innerHTML = str
        rmData()
    }

    // 删除购物车(删除localStorage,并更新)
    function rmData() {
        var delBtn = document.querySelectorAll('.selected tbody button')
        for (var i = 0; i < delBtn.length; i++) {
            delBtn[i].addEventListener('click', function () {
                delete selectedData[this.dataset.id]
                localStorage.setItem('cart', JSON.stringify(selectedData))
                this.parentNode.parentNode.remove()
                console.log(selectedData)
            })
        }
    }

    window.addEventListener('storage', function () {
        console.log('storage事件会在同一域下不同页面触发,即页面A、B同时注册了该事件，在A里操作storage对象发生变化只在B里面触发，反之亦然。')
        // 触发storage时,同步更新
        init()
    })
}())

