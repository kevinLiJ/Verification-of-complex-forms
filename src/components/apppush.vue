
<template>
  <div>
    <el-form-item label="主题" prop="title">
      <el-input v-model="ruleForm.title"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <el-input v-model="ruleForm.content"></el-input>
    </el-form-item>
    <el-form-item label="落地页" prop="targetUrl">
      <el-input v-model="ruleForm.targetUrl"></el-input>
      <span style="color:red;font-size:12px;">C端 落地页链接不是必填</span>
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
};
</script>