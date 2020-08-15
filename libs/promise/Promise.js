(function(window) {
  function Promise(executor) {
    const self = this 
    // 初始化
    this.status = 'pending'
    this.value = undefined
    this.callbacks = []

    function resolve(value) {
      if (self.status !== 'pending') {
        return 
      }
      self.status = 'fulfilled'
      self.value = value 
      // 若resolve为异步执行,则读取队列里的回调并异步执行
      if (self.callbacks.length > 0) {
        self.callbacks.forEach(callbacksObj => {
          setTimeout(() => {
            callbacksObj.onResolved(value)
          }, 0);
        })
      }
    }
    function reject(reason) {
      if (self.status !== 'pending') {
        return 
      }
      self.status = 'rejected'
      self.value = reason

      if (self.callbacks.length > 0) {
        self.callbacks.forEach(callbacksObj => {
          setTimeout(() => {
            callbacksObj.onRejected(reason)
          }, 0);
        })
      }
    }
    // 执行器(立即执行,同步回调
    try {
      executor(resolve, reject)
    } catch(err) { // 只要抛异常,状态则变为rejected
      reject(err)
    }
  }
  
  // 原型方法 then/catch

  /**
   * 1. 无论调用then方法的成功回调或失败回调then方法都会返回一个新的promise实例
   * 2. 返回的promise对象,其状态和值由传入的成功的回调或失败的回调返回的结果决定
   */
  Promise.prototype.then = function (onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {throw reason}
    const self = this
    return new Promise((resolve, reject) => {
      // 当前then方法对调用成功和失败回调函数的返回处理
      function handle(callback) {
        /**
         * 新的promise状态由onResolved/onRejected的执行结果决定,有三种情况:
         * 1. 当抛出异常,返回的promise为rejected,reason为异常
         * 2. 当返回的是promise,返回promise的结果就是这个结果
         * 3. 当返回的是非promise,返回的promise为fulfilled,value为该返回值
        */
        try {
          const result = callback(self.value)
          if (result instanceof Promise) {
            result.then(resolve, reject)
          } else { 
            resolve(result)
          }
        } catch (err) {
          reject(err)
        }
      }
      // 当前promise的状态为fulfilled时,则调用onResolved回调
      if (self.status === 'fulfilled') {  // 直接异步执行
        setTimeout(() => {
          handle(onResolved)
        }, 0)
      // 当前promise的状态为rejected时,则调用onRejected回调
      } else if(self.status === 'rejected') {
        setTimeout(() => {
          handle(onRejected)
        }, 0)
      // 当前promise的状态为pending时(当resolve/reject函数异步调用时),则保存回调异步执行
      } else {  
        self.callbacks.push(
          {
            onResolved() {
              handle(onResolved)
            },
            onRejected() {
              handle(onRejected)
            }
          }
        )
      }
    })
  }
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }

  // 静态方法resolve/reject/all/race
  Promise.resolve = function (value) {
    // 返回一个fulfilled或rejected的promise
   return new Promise((resolve, reject) => {
    //  当参数为promise对象时,返回的promise结果为[参数promise]的结果
     if (value instanceof Promise) {
       value.then(resolve, reject)
     } else { // 参数为非promise对象时,返回一个fulfilled的promise
       resolve(value)
     }
   })
  }
  Promise.reject = function (reason) {
    // 返回一个rejected的promise
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  Promise.all = function (promises) {
    const values = new Array(promises.length) // 存放对应promise个数的值的数组
    let fulfilledCount = 0  // 只有当所有promise都成功时,all方法才会放回成功
    return new Promise((resolve, reject) => {
      promises.forEach((promise, index) => {
        // promise.then(value => { promises里的每项可以是promise但是也可能是别的基本值
        Promise.resolve(promise).then(value => { // 一律转成promise就好了
          fulfilledCount++  // 进入一次then代表一个promise的成功
          values[index] = value   // all方法的结果与promises的顺序一致,所以不能用push
          if (fulfilledCount === promises.length) { // 当成功次数与传入promise次数一致时,说明全部成功了
            resolve(values)
          }
        },reason => { // 只要有一个失败,all方法返回失败
          reject(reason)
        })
      })
    })
  }
  Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
      // race方法只对第一个完成的作为结果(无论成功还是失败)
      promises.forEach(promise => {
        Promise.resolve(promise).then(
          value => {  
            resolve(value)
          },
          reason => { 
            reject(reason)
          }
        )
      })
    })
  }
  window.Promise = Promise
}(window))