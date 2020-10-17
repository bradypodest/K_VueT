import Dialog from '@/plug/dialog/dialog_box.vue'

// 定义插件对象
const DialogBox = {}

// vue的install方法，用于定义vue插件
DialogBox.install = function (Vue, options) {

  // 在Vue的原型上添加实例方法，以全局调用
  Vue.prototype.$ASC = {
    // 打开弹窗
    Show(options) {
      const DialogInstance = Vue.extend(Dialog)
      let DialogcurrentMsg = new DialogInstance()
      let msgBoxEl = DialogcurrentMsg.$mount().$el
      document.body.appendChild(msgBoxEl)

      if (typeof options === 'string') {
        DialogcurrentMsg.content = options
      } else if (typeof options === 'object') {
        Object.assign(DialogcurrentMsg, options)
      }
      return DialogcurrentMsg.show()
        .then(val => {
          DialogcurrentMsg = null
          return Promise.resolve(val)
        })
        .catch(err => {
          DialogcurrentMsg = null
          return Promise.reject(err)
        })
    },
  }
}

export default DialogBox
