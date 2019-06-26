
<template>
  <el-form
    :model="indexForm"
    ref="indexForm"
    label-width="100px"
    class="demo-indexForm"
    style="width:800px;margin:0 auto;"
    size="mini"
  >
    <template v-for="(item, index) in list">
      <component
        v-model="indexForm[item.prop]"
        v-bind="item"
        :key="index"
        :is="item.component"
      />
    </template>
    <component :ref="customMap.ref" :is="customMap.component" v-bind="customMap.props"/>

    <el-form-item>
      <el-button type="primary" @click="submitForm1()">立即创建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {Input} from "element-ui"

import apppush from "./apppush";
import message from "./message";
import mail from "./mail";

import FormItemHoc from "./form-item-hoc";
import BaseSelect from "./base-select";

const FormInput = FormItemHoc(Input);
const FormSelect = FormItemHoc(BaseSelect);

export default {
  data() {
    return {
      indexForm: {
        type: "1",
        name: "",
        customerType:"1"
      },
      list: [
        {
          prop: "customerType",
          component: FormSelect,
          selfProps: {
            placeholder: "请选择人群类型",
            options: [
              { label: "B端", value: "1" },
              { label: "C端", value: "2" }
            ]
          },
          hocProps: {
            prop: "customerType",
            label: "人群类型",
          },
        },
        {
          prop: "type",
          component: FormSelect,
          selfProps: {
            placeholder: "请选择类型",
            options: [
              { label: "短信", value: "1" },
              { label: "邮件", value: "2" },
              { label: "App Push", value: "3" }
            ]
          },
          hocProps: {
            prop: "type",
            label: "类型",
          },
        },
        {
          prop: "name",
          component: FormInput,
          hocProps: {
            prop: "name",
            label: "名称",
            rules: [
              { required: true, message: "请输入活动名称", trigger: "blur" },
              { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
            ]
          },
        }
      ],
      // 模拟的不同类型表单的提交
      fakeSubmit: {
        1: data => alert(`短信模板创建成功${JSON.stringify(data)}`),
        2: data => alert(`邮件模板创建成功${JSON.stringify(data)}`),
        3: data => alert(`push模板创建成功${JSON.stringify(data)}`)
      },
    };
  },

  computed: {
    customMap () {
      const type = this.indexForm.type;
      return [
        { ref: "message", component: message },
        { ref: "mail", component: mail },
        { 
          ref: "apppush", 
          component: apppush,
          props: {
            customerType: this.indexForm.customerType
          },
        },
      ][type - 1]
    }
  },
  methods: {
    // 父表单验证通过才会验证子表单，存在先后顺序
    submitForm() {
      // const templateType = this.typeMap[this.indexForm.type];
      const templateType = this.customMap.ref;
      this.$refs["indexForm"]
        .validate()
        .then(res => {
          // 父表单验证成功后，验证子表单
          return this.$refs[templateType].vaildate();
        })
        .then(res => {
          // 获取整体数据
          const reqData = {
            // 获取子组件数据
            ...this.$refs[templateType].getData(),
            ...this.indexForm
          };
          this.fakeSubmit[this.indexForm.type](reqData);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 父表单，子表单一起验证
    submitForm1() {
      // const templateType = this.typeMap[this.indexForm.type];
      const templateType = this.customMap.ref;
      const validate1 = this.$refs["indexForm"].validate();
      const validate2 = this.$refs[templateType].vaildate();
      // 父子表单一起验证
      Promise.all([validate1, validate2])
        .then(res => {
          // 都通过时，发送请求
          const reqData = {
            ...this.$refs[templateType].getData(),
            ...this.indexForm
          };
          this.fakeSubmit[this.indexForm.type](reqData);
        })
        .catch(err => {
          console.log(err);
        });
    },
  }
};
</script>