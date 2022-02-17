import React, { Component } from 'react'
import './index.css'

export default class Footer extends Component {
  // 全选/全不选
  checkedAll = (e) => {
    const checked = e.target.checked
    this.props.checkedAll(checked)
  }

  clearAllDone = () => {
    this.props.clearAllDone()
  }

  render() {
    const {todos} = this.props
    const totalTodo = todos.length 
    const todoCount = todos.reduce((prev, todo) => {
      return prev + (todo.done ? 1 : 0)
    }, 0)
    return (
      <div className="operArea">
          <div>
            <input 
              onChange={this.checkedAll}
              checked={todoCount === totalTodo && totalTodo !== 0}
              type="checkbox"
            />
            已完成<span> {todoCount}</span>
            {' / '}
            全部<span> {totalTodo}</span>
          </div>
          <button onClick={this.clearAllDone}>清除已完成</button>
        </div>
    )
  }
}
