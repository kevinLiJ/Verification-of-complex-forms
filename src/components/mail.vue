
<template>
  <div>
    <el-form-item label="主题" prop="title">
      <el-input v-model="ruleForm.title"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input v-model="ruleForm.content"></el-input>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    ruleForm: {
      type: Object,
      default: () => ({}),
    },
  },
  // data() {
  //   return {
  //     ruleForm: {
  //         content:'',
  //         title:''
  //     },
    //   rules: {
    //     content: [
    //       { required: true, message: "请输入内容", trigger: "blur" },
    //     ],
    //     title: [
    //       { required: true, message: "请输入主题", trigger: "blur" },
    //     ],
    //   }
    // };
  // },
  // methods: {
  //     vaildate(){
  //         return this.$refs['ruleForm'].validate();
  //     },
  //     getData(){
  //         return this.ruleForm
  //     },  
  //   resetForm() {
  //     this.$refs['ruleForm'].resetFields();
  //   },
  // }
};
</script>