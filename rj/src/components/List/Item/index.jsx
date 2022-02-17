import React, { Component } from 'react'

export default class List extends Component {
  state = {
    isMouseEnter: false
  }
  // 鼠标移入、移出todo项的样式变化
  handleMouse = (mouseState) => {
    return (e) => { //高阶函数柯里化的方式实现
     this.setState({
       isMouseEnter: mouseState ? true : false 
     })
    }
  }
  // 删除某项todo
  delTodo = (id) => {
    if (window.confirm('确定删除此项？')) {
      // 祖孙传值 App->List->Item(当前组件)
      this.props.delTodo(id)
    }
  }
  // 修改某项todo完成/未完状态
  updateTodo =(id) => {
    return (e) => {
      this.props.updateTodo(id, e.target.checked)
    }
  }

  render() {
    const {id, name, done} = this.props
    const isMouseEnter = this.state.isMouseEnter
    return (
      <li
        onMouseEnter={this.handleMouse(true)}
        onMouseLeave={this.handleMouse(false)}
        style={{
          backgroundColor: isMouseEnter ? '#eee' : '#fff'
        }}
        className="list_item"
      >
          <label htmlFor={id}>
            <input
              checked={done}
              onChange={this.updateTodo(id)}
              id={id} 
              type="checkbox" 
            />
            {name}
          </label>
          <button
            onClick={(e) => this.delTodo(id)}
            style={{display: isMouseEnter ? 'block': 'none'}}
          >
            删除
          </button>
      </li>
    )
  }
}
