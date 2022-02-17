const express = require('express')
const app = express()

app.use((req, res, next) => {
	console.log('有人请求服务器 A 了','请求来自于：', req.get('Host'),'要请求的地址是：',req.url)
	next()
})

app.get('/students', (req, res) => {
	const students = [
		{id:'001',name:'tom',age:18},
		{id:'002',name:'jerry',age:19},
		{id:'003',name:'tony',age:120},
	]
	res.send(students)
})

app.listen(5000, err => {
	if (!err) console.log('server A启动成功,请求学生地址为：http://localhost:5000/students')
})