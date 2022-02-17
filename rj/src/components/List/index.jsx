import React, { Component } from 'react'
import Item from './Item'
import './index.css'

export default class List extends Component {
  renderTodos = () => {
    const {todos, filterText, delTodo, updateTodo} = this.props 
    const rows = todos.map(todo => {
      if (todo.name.indexOf(filterText) === -1) return 
      return <Item key={todo.id} {...todo} delTodo={delTodo} updateTodo={updateTodo} />
    })
    return rows
  }
  render() {
    return (
      <ul className="todo_list">
        {this.renderTodos()}
      </ul>
    )
  }
}
