import React, { memo } from 'react'

const App = memo(() => {
  const getStudent = async () => {
    // 所处协议、主机和端口一致，则这三个可省略
    // const res = await fetch('http://localhost:3000/api1/students')
    const res = await fetch('/api1/students')
    const data = await res.json()
    console.log('student data', data)
  }
  const getCar = async () => { 
    const res = await fetch('/api2/cars')
    const data = await res.json()
    console.log('car data', data)
   }

  return (
    <div>
      <button onClick={getStudent}>getStudent</button>
      <button onClick={getCar}>getCar</button>
    </div>
  )
})

export default App