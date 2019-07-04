
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
        v-on="item.on"
      />
    </template>
  
    <component
      ref="mapForm"
      :is="customMap.component"
      :hocProps="customMap.hocProps"
      :selfProps="{
        ruleForm: customMap.hocProps.model
      }"
    />

    <el-form-item>
      <el-button type="primary" @click="submitForm()">立即创建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {Input} from "element-ui"

import apppushTemplate from "./apppush";
import messageTemplate from "./message";
import mailTemplate from "./mail";

import FormHoc from "./form-hoc";
import FormItemHoc from "./form-item-hoc";
import BaseSelect from "./base-select";

const FormInput = FormItemHoc(Input);
const FormSelect = FormItemHoc(BaseSelect);
const apppush = FormHoc(apppushTemplate)
const message = FormHoc(messageTemplate)
const mail = FormHoc(mailTemplate)

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
            ],
          },
          hocProps: {
            prop: "customerType",
            label: "人群类型",
          },
          on: {
            'selectClick': (value) => {
              console.log(value)
            },
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
      map: [
        {
          component: message,
          hocProps: {
            labelWidth: "100px",
            size: "mini",
            model: {
              content: "",
            },
            rules: {
              content: [
                { required: true, message: "请输入内容", trigger: "blur" },
                { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
              ],
            },
          },
        },
        {
          component: mail,
          hocProps: {
            labelWidth: "100px",
            size: "mini",
            model: {
              content:'',
              title:'',
            },
            rules: {
              content: [
                { required: true, message: "请输入内容", trigger: "blur" },
              ],
              title: [
                { required: true, message: "请输入主题", trigger: "blur" },
              ],
            },
          },
        },
        {
          component: apppush,
          hocProps: {
            labelWidth: "100px",
            size: "mini",
            model: {
              content: '',
              title: '',
              targetUrl: '',
            },
            rules: {
              content: [
                { required: true, message: "请输入内容", trigger: "blur" },
                { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
              ],
              title: [
                { required: true, message: "请输入主题", trigger: "blur" },
                { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
              ],
              targetUrl: [
                {
                  validator: (rule, value, callback) => {
                    if (this.customerType === "1" && value === "") {
                      callback(new Error("请输入落地页链接"));
                    } else {
                      callback();
                    }
                  }
                }
              ],
            },
          },
        },
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
      const index = this.indexForm.type - 1;
      if (index === 2) {
        this.map[index].hocProps.customerType = this.indexForm.customerType
      }
      return this.map[index]
    }
  },
  methods: {
    // 父表单验证通过才会验证子表单，存在先后顺序
    submitForm() {
      const templateType = 'mapForm';

      this.$refs["indexForm"]
        .validate()
        .then(res => {
          // 父表单验证成功后，验证子表单
          return this.$refs[templateType].validate();
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
      const templateType = 'mapForm';
      const validate1 = this.$refs["indexForm"].validate();
      const validate2 = this.$refs[templateType].validate();

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