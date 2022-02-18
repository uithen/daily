import React, { memo, useRef } from 'react'
import PubSub from 'pubsub-js'

const Search = memo(() => {
  const inputEl = useRef(null)
  const clickSearch = async () => {
    const keywords = inputEl.current.value
    PubSub.publish('list collection', {isFirst: false, isLoading: true})
    try {
      const res = await fetch(`https://api.github.com/search/users?q=${keywords}`)
      const data = await res.json()
      PubSub.publish('list collection', {isLoading: false, userList: data.items})
    } catch (err) {
      console.log('请求出错',err)
      PubSub.publish('list collection', {isLoading: false, err: err.message})
    }
  }
  return (
    <section className="jumbotron">
        <h3 className="jumbotron-heading">Search Github Users</h3>
        <div>
          <input ref={inputEl} type="text" placeholder="enter the name you search"/>
          <button onClick={clickSearch}>Search</button>
        </div>
     </section>
  )
})

export default Search