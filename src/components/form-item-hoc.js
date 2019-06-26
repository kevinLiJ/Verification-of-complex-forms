import {FormItem} from "element-ui"

// 拦截分发props 到对应组件
export default function (WrappedComponent) {
  return {
    inheritAttrs: false,

    props: {
      hocProps: {
        type: Object,
        default: () => ({}),
      },
      selfProps: {
        type: Object,
        default: () => ({}),
      },
    },

    render (h) {
      return h(FormItem,
        {
          props: this.hocProps,
        },
        [
          h(WrappedComponent, {
            on: this.$listeners,
            props: this.selfProps,
            attrs: this.$attrs,
          }),
        ],
      )
    },
  }
}
