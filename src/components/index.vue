
<template>
  <el-form
    :model="indexForm"
    :rules="rules"
    ref="indexForm"
    label-width="100px"
    class="demo-indexForm"
    style="width:800px;margin:0 auto;"
    size="mini"
  >
  <el-form-item label="人群类型" prop="customerType">
      <el-select v-model="indexForm.customerType" placeholder="请选择人群类型">
        <el-option label="B端" value="1"></el-option>
        <el-option label="C端" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-select v-model="indexForm.type" placeholder="请选择类型">
        <el-option label="短信" value="1"></el-option>
        <el-option label="邮件" value="2"></el-option>
        <el-option label="App Push" value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="indexForm.name"></el-input>
    </el-form-item>
    <message ref="message" v-if="indexForm.type==='1'"/>
    <mail ref="mail" v-if="indexForm.type==='2'"/>
    <apppush :customerType="indexForm.customerType" ref="apppush" v-if="indexForm.type==='3'"/>
    <el-form-item>
      <el-button type="primary" @click="submitForm1()">立即创建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import apppush from "./apppush";
import message from "./message";
import mail from "./mail";
export default {
  data() {
    return {
      indexForm: {
        type: "1",
        name: "",
        customerType:'1'
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      typeMap: {
        1: "message",
        2: "mail",
        3: "apppush"
      },
      // 模拟的不同类型表单的提交
      fakeSubmit: {
        1: data => alert(`短信模板创建成功${JSON.stringify(data)}`),
        2: data => alert(`邮件模板创建成功${JSON.stringify(data)}`),
        3: data => alert(`push模板创建成功${JSON.stringify(data)}`)
      },
    };
  },
  components: {
    apppush,
    mail,
    message
  },
  methods: {
    // 父表单验证通过才会验证子表单，存在先后顺序
    submitForm() {
      const templateType = this.typeMap[this.indexForm.type];
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
      const templateType = this.typeMap[this.indexForm.type];
      const validate1 = this.$refs["indexForm"].validate();
      const validate2 = this.$refs[templateType].vaildate();
      父子表单一起验证
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