import React from 'react'
import SearchBar from './components/SearchBar'
import List from './components/List'
import Footer from './components/Footer'
import './App.css'

class App extends React.Component {
  state = {
    todos: [
      {id: '1', name: 'xxx', done: false},
      {id: '2', name: 'yyy', done: true},
      {id: '3', name: 'aaa', done: false},
      {id: '4', name: 'bbb', done: false},
    ],
    filterText: ''
  }
  // search todo 
  handleFilterText = (filterText) => {
    this.setState({filterText})
  }
  // add todo
  addTodo = (todo) => {
    this.setState({
      todos: [todo, ...this.state.todos]
    })
  }
  // del todo
  delTodo = (todoId) => {
    this.setState({
      todos: this.state.todos.filter(todo => todo.id !== todoId)
    })
  }
  // update todo
  updateTodo = (todoId, checked) => {
    const {todos} = this.state 
    const newTodos = todos.map(todo => {
      if (todo.id === todoId) {
        // todo.done = checked 
        // return todo
        return {...todo, done: checked}
      }
      return todo
    })
    this.setState({
      todos: newTodos
    })
  }

  // checked or not checked all 
  checkedAll = (checked) => {
    const newTodos = this.state.todos.map(todo => {
      // todo.done = checked ? true : false 
      // return todo
      return {...todo, done: checked ? true : false}
    })
    this.setState({
      todos: newTodos
    })
  }

  // clear all done
  clearAllDone = () => {
    const newTodos = this.state.todos.filter(todo => {
      return !todo.done 
    })
    this.setState({
      todos: newTodos
    })
  }

  render() {
    const {todos, filterText} = this.state
    return (
      <div className='todo_wrapper'>
        <SearchBar
          todos={todos}
          handleFilterText={this.handleFilterText}
          addTodo={this.addTodo}
        />
        <List
          todos={todos}
          filterText={filterText} 
          delTodo={this.delTodo}
          updateTodo={this.updateTodo}
        />
        <Footer
          todos={todos} 
          checkedAll={this.checkedAll} 
          clearAllDone={this.clearAllDone}
        />
      </div>
    )
  }
}

export default App