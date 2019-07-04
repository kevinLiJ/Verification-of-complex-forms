import {Form} from "element-ui"

// 拦截分发props 到对应组件
export default function (WrappedComponent) {
  return {
    inheritAttrs: false,

    // component: {
    //   ElForm: Form,
    //   Embedded: WrappedComponent,
    // },

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
      validate () {
        return this.$refs.ruleForm.validate();
      },

      getData () {
        return this.hocProps.model;
      },
    },

    // template: `
    //   <el-form ref="ruleForm" class="demo-ruleForm" v-bind="hocProps">
    //     <wrapped-component v-on="$listeners" v-bind="$attrs"></wrapped-component>
    //   </el-form>
    // `,

    render (h) {
      return h(Form,
        {
          ref: 'ruleForm',
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
