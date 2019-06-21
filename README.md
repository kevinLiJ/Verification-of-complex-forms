复杂的表单验证：父表单嵌套不同子表单时，验证提交数据的解决方案

### 背景
> 当我们在做后台管理系统时，经常会遇到非常复杂的表单：
> + 表单项非常多
> + 在各种表单类型下，显示的表单项不同
> + 在某些条件下，某些表单项会关闭验证
> + 在这种错综复杂的情况下，完成表单的验证和提交
> + 每个表单项还会有其他自定义逻辑，比如**输入框可以插入模板变量、输入字符数量显示、图片上传并显示、富文本**。。。

### 普通的方式
> 所有的显示隐藏逻辑、数据获取提交逻辑 放在一起
> + 根据表单类型，使用`v-if/v-show`处理表单项显示隐藏
> + 在表单验证逻辑中加入条件，判断是否验证
> + 根据表单类型，获取不同的数据，并提交
> + 其余所有的自定义逻辑

##### 缺点
+ 乱
+ 乱
+ 还是乱
+ 一个`vue`文件，轻轻松松上`2000`行
  

### 分离组件
> 其实很容易想到不同的表单类型，分离出不同的子表单。但我在实践时还是遇到了很多问题，并总结出一套解决方案

##### 1. 子组件

`validate`方法：返回`elementUI`表单验证的`promise`对象。用于父组件调用，验证自己组件的表单项
```js
vaildate() {
    return this.$refs["ruleForm"].validate();
},
    
```
`getData`方法：用于父组件调用，提取子组件中的数据
```js
getData() {
    return this.ruleForm;
},
```

##### 2. 父组件
`submit`方法：父子组件表单验证、获取整体数据、根据不同类型发送不同接口。

+ 使用[策略模式](https://www.cnblogs.com/xiaohuochai/p/8029651.html)获取当前类型表单的`ref`和提交函数。省略了大量的`if-else`判断。

  ```js
  data:{
    // ref名称
    typeMap: {
        1: "message",
        2: "mail",
        3: "apppush"
    },
    // 模拟的不同类型表单的提交,url会不同
    fakeSubmit: {
        1: data => alert(`短信模板创建成功${JSON.stringify(data)}`),
        2: data => alert(`邮件模板创建成功${JSON.stringify(data)}`),
        3: data => alert(`push模板创建成功${JSON.stringify(data)}`)
    },
  }
  ```
+ `elementUI`表单验证`validate`方法可以返回`promise`结果,可以利用`promise`的特性来处理父子表单的验证。比如[`then`函数可以返回另一个`promise`对象](https://juejin.im/post/5cc17448f265da0379417cfc#heading-0)、[`catch`可以获取它以上所有`then`的`reject`](https://juejin.im/post/5cc17448f265da0379417cfc#heading-1)、[`Promise.all`](https://juejin.im/post/5cc17448f265da0379417cfc#heading-6)。
  + 父表单验证通过才会验证子表单，存在先后顺序
    ```js
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
    ```
  + 父表单，子表单一起验证
      ```js
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
      ```
> 总结：很多项目我都遇到这种复杂的表单，也用了很多种解决方案，在此总结出了一种比较整洁简便的方案。当然还有其他很多方案，比如**可以把数据提交的方法放在每一个子组件中，公共的表单项数据通过`props`传递给子组件用于提交**。有其他更加简洁的方案，欢迎评论，或者`github`上提`issue`
> 
> 题外话： 看了[前端架构师亲述：前端工程师成长之路的 N 问 及 回答](https://juejin.im/post/5d0ba00af265da1bc7524043#heading-3)中的几个回答后，对我有很大的启发。在对自己的技术方向、前景迷茫时，或者在埋怨自己的项目太low时，或者埋怨自己每天在做重复工作时，或者每天对层出不穷的新技术焦头烂额时，**不妨认真的审视下自己的项目，每天重复的工作，是不是可以自己造轮子了；项目太low，是不是可以平滑过渡到新技术，提高开发效率。学再多的新技术，最终也会回归并实践到项目中，所以做好当前很重要。从工作和项目的痛点出发，你会一边探索一边进步，一步步走向大神级别**