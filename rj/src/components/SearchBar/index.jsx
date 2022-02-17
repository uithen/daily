import React, { Component } from 'react'
import {nanoid} from 'nanoid'
import './index.css'

export default class SearchBar extends Component {
  // 收集input内容,搜索todo列表
  handleSearch = (e) => {
    const pureFilterText = e.target.value.trim()
    this.props.handleFilterText(pureFilterText)
  }
  // 按下[回车]添加一个todo项，更新状态重新渲染todo列表
  handleKeyUp = (e) => {
    if (e.keyCode !== 13) return 
    const pureFilterText = e.target.value.trim()
    // MDN: 除了抛出异常以外，没有办法中止或跳出 forEach() 循环。如果你需要中止或跳出循环，不应当用forEach
    // this.props.todos.forEach(todo => {
    //   if (pureFilterText === todo.name) {
    //     alert('待办列表中已有与当前重名的事项，请重新命个事项名吧')
    //     return 
    //   }
    // })
    for (const todo of this.props.todos) {
      if (pureFilterText === todo.name) {
        alert('待办列表中已有与当前重名的事项，请重新命个事项名吧')
        return 
      }
    }
    const todo = {id: nanoid(6), name: pureFilterText, done: false}
      // 添加todo项
    this.props.addTodo(todo)
    // 添加后清空input
    e.target.value = ''
    // 还须更改状态中的input值，界面依赖它，不然不会正确更新页面
    this.props.handleFilterText('')
  }
  render() {
    return (
      <div className="searchBar">
        <input
          onChange={this.handleSearch}
          onKeyUp={this.handleKeyUp}
          type="text" placeholder="search or type enter to add" 
        />
      </div>
    )
  }
}
