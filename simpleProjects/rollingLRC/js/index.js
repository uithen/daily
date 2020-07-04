var lrc = `[00:00.000]天下有情人
[00:46.333]作曲 : 周华健
[00:48.666]作词 : 林夕
[00:50.000]编曲 : 洪敬尧
[00:52.000]
[00:54.333]合：爱怎么做 怎么错
[00:56.075]怎么看 怎么难
[00:57.490]怎么教人死生相随
[01:00.838]爱是一种
[01:01.852]不能说 只能尝的滋味
[01:04.116]试过以后不醉不归
[01:07.491]等到红颜憔悴
[01:10.537]它却依然如此完美
[01:14.032]等到什么时候
[01:17.078]我们才能够体会
[01:20.243]爱是一朵
[01:21.291]六月天 飘下来的雪花
[01:23.504]还没结果已经枯萎
[01:26.698]爱是一滴
[01:27.689]擦不干 烧不完的眼泪
[01:30.017]还没凝固已经成灰
[01:33.438]等到情丝吐尽
[01:36.455]它才出现那一回
[01:40.058]等到红尘残碎
[01:43.022]它才让人双宿双飞
[01:46.284]啊～
[01:55.960]有谁懂得个中滋味
[01:58.407]男：爱是迷迷糊糊
[02:00.054]天地初开的时候
[02:02.069]那已经盛放的玫瑰
[02:04.933]女：爱是踏破红尘 望穿秋水
[02:07.327]只因为爱过的人不说后悔
[02:11.398]男：爱是一生一世
[02:12.954]一次一次的轮回
[02:15.024]不管在东南和西北
[02:17.855]女：爱是一段一段
[02:19.422]一丝一丝的是非
[02:21.897]合：教有情人再不能够 说再会
[02:28.038]
[02:51.113]爱是一朵
[02:52.140]六月天 飘下来的雪花
[02:54.336]还没结果已经枯萎
[02:57.588]爱是一滴
[02:58.561]擦不干 烧不完的眼泪
[03:00.866]还没凝固已经成灰
[03:04.261]等到情丝吐尽
[03:07.359]它才出现那一回
[03:10.726]等到红尘残碎
[03:13.760]它才让人双宿双飞
[03:16.288]啊～
[03:26.738]有谁懂得个中滋味
[03:29.135]男：爱是迷迷糊糊
[03:30.821]天地初开的时候
[03:32.846]那已经盛放的玫瑰
[03:35.780]女：爱是踏破红尘 望穿秋水
[03:38.148]只因为爱过的人不说后悔
[03:42.233]男：爱是一生一世
[03:43.817]一次一次的轮回
[03:45.883]不管在东南和西北
[03:48.728]女：爱是一段一段
[03:50.324]一丝一丝的是非
[03:52.824]教有情人再不能够 说再会
[03:58.508]男：爱是迷迷糊糊
[04:00.067]天地初开的时候
[04:02.122]那已经盛放的玫瑰
[04:04.952]女：爱是踏破红尘 望穿秋水
[04:07.355]只因为爱过的人不说后悔
[04:11.464]男：爱是一生一世
[04:13.014]一次一次的轮回
[04:15.130]不管在东南和西北
[04:17.938]女：爱是一段一段
[04:19.579]一丝一丝的是非
[04:22.007]合：教有情人再不能够 说再会
[04:46.935]`
var lrcWrap = document.querySelector('.lrc-wrap')
    ul = lrcWrap.querySelector('#ul'),
    player = document.querySelector('#audio')
// [00:00.000] 作曲 : 周华健 [00:00.666] 作词 : 林夕' ===> ['[00:00.000] 作曲 : 周华健', '[00:00.666] 作词 : 林夕']
function getLrcArr() {
    var lrcArr = lrc.split('\n')
    // ['[00:00.000] 作曲 : 周华健', '[00:00.666] 作词 : 林夕'] ==> [{time: xx秒, words: '作曲 : 周华健'}]
    lrcArr.forEach(function (item, index, arr) {
        arr[index] = (function () {
            var twoParts = arr[index].split(']')
                timeStr = twoParts[0].split('[')[1],
                minutes = +timeStr.split(':')[0],
                seconds = +timeStr.split(':')[1],
                time = minutes * 60 + seconds,
                words = twoParts[1]
            return {
                time,
                words
            }
        }())
    })
    return lrcArr
}
// 保存格式化后的歌词
var lrcArr = getLrcArr()

// 创建歌词列表
function renderLrc() {
    lrcArr.forEach(function (item, index) {
        var li = document.createElement('li')
        li.innerText = lrcArr[index].words 
        ul.appendChild(li)
    })
}
renderLrc()

// 设置歌词位置(始终让高亮歌词在可视区的中线显示)
function setLrcPos() {
    var lrcIndex = getLrcIndex()
    if (lrcIndex === -1) {
        return 
    }
    var wrapHeight = parseInt(getComputedStyle(lrcWrap).height), //歌词可视区容器高度
        liHeight = 35   // 每句歌词高度(li)
    // 每个li滚动的本质是改变ul的margin-top负值,只要算出ul超出可视区顶部的距离,就能拿到当前高亮歌词时间线(即可视区中线)
    var scrollTop = lrcIndex * liHeight + liHeight / 2 - wrapHeight / 2
    if (scrollTop < 0) {
        scrollTop = 0   // 歌词第一行位置,最低只能在可视区顶部位置
    }
    ul.style.marginTop = -scrollTop + 'px'
    var curCls = ul.querySelector('.active') 
    if (curCls) {   
        curCls.className = ''
    }
    ul.children[lrcIndex].className = 'active' // 当前歌词高亮
}
var weitiao = .6 // 此次测试的歌曲歌词文件时间稍微有点对不上,这里手动微调下
// 获取每条歌词的索引
function getLrcIndex() {
    var time = player.currentTime + weitiao // 歌曲当前进度条实时播放时间(原生方法)
    for (var i = 0; i < lrc.length; i++) {
        if (time < lrcArr[i].time) {
            return i - 1    // 返回上一句歌词的下标(高亮歌词)
        }
    }  
}

// timeupdate事件只要播放器时间变化就会触发
player.addEventListener('timeupdate', function () {
    setLrcPos()
})
