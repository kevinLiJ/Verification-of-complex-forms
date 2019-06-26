<template>
  <el-select v-bind="$attrs" v-on="$listeners">
    <el-option
      v-for="item in options"
      v-bind="item"
      :key="item.key"
    />
  </el-select>
</template>

<script>
  export default {
    name: 'BaseSelect',

    inheritAttrs: false,

    props: {
      options: {
        type: Array,
        default: () => [],
      },
    },
  }
</script>
