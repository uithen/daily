
/**
 * 瀑布流布局原理及实现思路:
 * 原理:
 *    每个内容(item)宽度固定,高度跟随图片本身大小,视觉表现为参差不齐的多栏布局
 *    一行排满后，其余内容框就会按顺序排在短的一列后
 * 实现:
 *    1. 设定一个5列的排版(列数可以根据需求自定义)
 *    2. 使用offsetHeight可以获取每列的高度,找到最小高度的列并保存它的索引,该索引就是下一次append item时候要插入的位置
 */

const waterfall = {
  init(options) {
    this.initData(options)
    this.render()
    this.handle()
  },
  initData(options) {
    this.el = options.el || document.querySelector('body')
    getData(dataList, dataList => this.itemsData = dataList)
  },
  render() {
    this.el.innerHTML = `
      ${this.renderColumn()}
      <div class="more">查看更多</div>
    `
    this.renderItem()
  },
  // 此demo设置的是按5列排版
  renderColumn() {
    let template = ''
    for (let i = 0; i < 5; i++) {
      template += `<div class="item-column"></div>`
    }
    return template
  },
  renderItem() {
    let oCol = this.el.querySelectorAll('.item-column')
    // 插入伪数据到最短列
    for (let i = 0; i < this.itemsData.length; i++) {
      let itemInfo = this.itemsData[i]
      let minColIndex = this.getMinColIndex()
      let oItem = document.createElement('div')
      oCol[minColIndex].appendChild(oItem)
      oItem.outerHTML = this.itemTemplate(itemInfo)
    }
    
  },
  // 获取最短列的索引
  getMinColIndex() {
    let oCol = this.el.querySelectorAll('.item-column'),
        minColHeight = oCol[0].offsetHeight,
        minIndex = 0
    for (let i = 1; i < oCol.length; i++) {
      let colHeight = oCol[i].offsetHeight 
      if (colHeight < minColHeight) {
        minColHeight = colHeight
        minIndex = i 
      }
    }
    return minIndex
  },
  itemTemplate(itemInfo) {
    return `
      <div class="item">
        <div class="item-info">
          <div class="item-img">
            <img src="${itemInfo.cover.url} alt="">
            <i class="video"></i>
          </div>
          <h3 class="info">${itemInfo.title}</h3>
        </div>
        <div class="item-append">
          <div class="user"></div>
          <div class="avatar">
            <img src="./images/avatar.jpg" alt="">
            <i class="verified"></i>
          </div>
          <div class="name">${itemInfo.user.nickname}</div>
          <div class="like">
            <i class="heart"></i>
            <span class="likes">${itemInfo.likes}</span>
          </div>
        </div>
      </div>
    `
  },
  handle() {
    let oMore = this.el.querySelector('.more')
    oMore.addEventListener('click', function () {
      getData(dataList, () => this.renderItem())
    }.bind(this))
  }
}