import {Form} from "element-ui"

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

    methods: {
      ...Form.methods,

      getData () {
        return this.hocProps.model;
      },
    },

    render (h) {
      return h(Form,
        {
          class: ['demo-ruleForm'],
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
