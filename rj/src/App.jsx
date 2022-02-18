import React, { Component } from 'react'
import './App.css'
import Search from './components/Search'
import Content from './components/Content'

export default class App extends Component {
  render() {
    return (
      <div className="container">
        <Search />
        <Content />
      </div>
    )
  }
}
