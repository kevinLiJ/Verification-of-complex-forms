
<template>
  <div>
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
};
</script>