$(function () {
    // 刷新页面或关闭打开浏览器保留渲染
    load()
    // 1. 用户输入数据按下回车存于本地
    $('#title').on('keydown', function (e) {
        if (e.keyCode === 13) {
            if ($(this).val() === '') {
                alert('内容不能为空')
            } else {
                // 读取原有的本地存储数据
                var local = getData()
                // 更新本地数据
                local.push({
                    title: $(this).val(),
                    done: false 
                })
                saveData(local)

                // 2. 渲染数据
                load()
                $(this).val('')
            }
        }
    })
    // 3. 删除数据
    $('ol, ul').on('click', 'a', function () {
        // 先获取本地数据
        var data = getData()
        // 记录当前a的索引(删除数据)
        var index = $(this).attr('id')
        data.splice(index, 1)
        // 更新到本地
        saveData(data)
        // 重新传染
        load()
    })
    // 4. 正在进行和已完成操作
    $('ol, ul').on('click', 'input', function () {
        // 同步骤3
        var data = getData()
        var index = $(this).siblings('a').attr('id')
        // console.log(index)
        data[index]['done'] = $(this).prop('checked')
        saveData(data)
        load()
    })
    // 读取本地存储数据
    function getData() {
        var data = localStorage.getItem('todolist')
        if (data) {
            return JSON.parse(data)
        }else {
            return []
        }
    }
    // 保存本地存储数据
    function saveData(data) {
        localStorage.setItem('todolist', JSON.stringify(data))
    }
    // 渲染加载数据
    function load() {
        var data = getData()
        // 防止二次渲染
        $('ol, ul').empty()
        var todoCount = 0
        var doneCount = 0
        $.each(data, function (i, n) {
            if (n.done) {
                $('ul').prepend('<li><input type="checkbox" checked><p>'+ n.title +'</p><a href="javascript:;" id = '+ i +'>-</a></li>') 
                doneCount++
            }else {
                $('ol').prepend('<li><input type="checkbox"><p>'+ n.title +'</p><a href="javascript:;" id = '+ i +'>-</a></li>')        
                todoCount++
            }
        })
        // 事宜件数统计
        $('#todocount').text(todoCount)
        $('#donecount').text(doneCount)
    }
    // 一次性清空所有数据
    $('footer').on('click', 'a', function () {
        localStorage.clear()
        load()
    }) 
})