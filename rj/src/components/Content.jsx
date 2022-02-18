import React, { Component } from 'react'
import PubSub from 'pubsub-js'

export default class Content extends Component {
  state = {
    userList: [],
      isFirst: true,
      isLoading: false,
      err: ''
  }
  componentDidMount() {
    this.pubSubID = PubSub.subscribe('list collection', (msgName, listCollection) => {
      console.log('msgName', msgName)
      this.setState(listCollection)
    })
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pubSubID )
  }

  render() {
    const {userList, isFirst, isLoading, err} = this.state 
    return (
      <div className="row">
        {
          isFirst ? <h3>欢迎使用，输入关键字，随后点击搜索</h3> :
          isLoading ? <div>loading...</div> :
          err ? <div style={{color: 'red'}}>{err}</div> :
          userList.map(user => {
            return (
              <div className="card" key={user.id}>
                <a href={user.html_url} target="_blank" rel="noreferrer">
                  <img src={user.avatar_url} alt="avatar" style={{width: '100px'}} />
                </a>
                <p className="card-text">{user.login}</p>
              </div>
            )
          })
        }
    </div>
    )
  }
}
