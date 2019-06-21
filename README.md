
## 背景
 当我们在做后台管理系统时，经常会遇到非常复杂的表单：
> + 表单项非常多
> + 在各种表单类型下，显示不同的表单项
> + 在某些条件下，某些表单项会关闭验证
> + 每个表单项还会有其他自定义逻辑，比如**输入框可以插入模板变量、输入字符数量显示、图片上传并显示、富文本**。。。
> + 在这种错综复杂的情况下，完成表单的验证和提交
> + [可以查看具体例子](https://kevinlij.github.io/Verification-of-complex-forms/)：例子中省略了很多琐碎的功能，只保留整体的复杂表单框架，用于展示解决方案

## 方案1： 在一个`vue`文件中
 所有的表单项显示隐藏、验证、数据获取、提交、自定义等逻辑放在一起
> + 根据表单类型，使用`v-if/v-show`处理表单项显示隐藏
> + 在`elementui`自定义验证中，根据表单类型，判断表单项是否验证
> + 根据表单类型，获取不同的数据，并提交到不同的接口
> + 其余所有的自定义逻辑

#### 缺点
+ 乱
+ 乱
+ 还是乱
+ 一个`vue`文件，轻轻松松上`2000`行
+ 在我尝试加入一种新的表单类型时，我发现我已经无。从。下。手。
  

## 方案2：分离组件
> 其实很容易想到**根据不同的表单类型，分离出多个相应类型的子表单**。但我在实践时还是遇到了很多问题：**父子表单验证、整体提交数据的获取**等等，并总结出一套解决方案：

### 1. 子组件
所有的子组件中都需要包含两个方法`validate`、`getData`供父组件调用。

#### (1) **`validate`方法**
用于验证本身组件的表单项，并返回一个`promise`对象
```js
vaildate() {
    // 返回`elementUI`表单验证的结果（为`promise`对象）
    return this.$refs["ruleForm"].validate();
},
    
```
#### (2) **`getData`方法**
提供子组件中的数据
```js
getData() {
    // 返回子组件的form
    return this.ruleForm;
},
```

### 2. 父组件

#### (1) [策略模式](https://www.cnblogs.com/xiaohuochai/p/8029651.html)
使用策略模式存储并获取**子表单的`ref`**(用于获取子表单的方法)和**提交函数** 。省略了大量的`if-else`判断。

  ```js
  data:{
    // type和ref名称的映射
    typeRefMap: {
        1: "message",
        2: "mail",
        3: "apppush"
    },
    // type和提交函数的映射。不同类型，接口可能不同
    typeSubmitMap: {
        1: data => alert(`短信模板创建成功${JSON.stringify(data)}`),
        2: data => alert(`邮件模板创建成功${JSON.stringify(data)}`),
        3: data => alert(`push模板创建成功${JSON.stringify(data)}`)
    },
  }
  ```
  
#### (2) **`submit`方法**
用于**父子组件表单验证、获取整体数据、调用当前类型提交函数提交数据**
> **因为`elementUI`表单验证的`validate`方法可以返回`promise`结果**，可以利用`promise`的特性来处理父子表单的验证。
比如[`then`函数可以返回另一个`promise`对象](https://juejin.im/post/5cc17448f265da0379417cfc#heading-0)、[`catch`可以获取它以上所有`then`的`reject`](https://juejin.im/post/5cc17448f265da0379417cfc#heading-1)、[`Promise.all`](https://juejin.im/post/5cc17448f265da0379417cfc#heading-6)。

+ 父表单验证通过才会验证子表单，存在先后顺序
    ```js
    // 父表单验证通过才会验证子表单，存在先后顺序
    submitForm() {
        const templateType = this.typeRefMap[this.indexForm.type];
        this.$refs["indexForm"]
        .validate()
        .then(res => {
            // 父表单验证成功后，验证子表单
            return this.$refs[templateType].vaildate();
        })
        .then(res => {
            // 全部验证通过
            // 获取整体数据
            const reqData = {
                // 获取子组件数据
                ...this.$refs[templateType].getData(),
                ...this.indexForm
            };
            // 获取当前表单类型的提交函数，并提交
            this.typeSubmitMap[this.indexForm.type](reqData);
        })
        .catch(err => {
            console.log(err);
        });
    },
    ```
+ 父表单，子表单一起验证
  ```js
  submitForm1() {
    const templateType = this.typeRefMap[this.indexForm.type];
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
        this.typeSubmitMap[this.indexForm.type](reqData);
      })
      .catch(err => {
        console.log(err);
      });
  },
  ```

#### 查看[在线项目](https://kevinlij.github.io/Verification-of-complex-forms/)、[项目github](https://github.com/kevinLiJ/Verification-of-complex-forms)和[组件代码](https://github.com/kevinLiJ/Verification-of-complex-forms/tree/master/src/components)

> 总结：很多项目我都遇到这种复杂的表单，也用了很多种解决方案，在此总结出了一种比较整洁简便的方案。当然还有其他很多方案，比如**可以把数据提交的方法放在每一个子组件中，公共的表单项数据通过`props`传递给子组件用于提交**。有其他更加简洁的方案，欢迎评论，或者[`github`上提`issue`](https://github.com/kevinLiJ/Verification-of-complex-forms/issues)


> 题外话： 看了[前端架构师亲述：前端工程师成长之路的 N 问 及 回答](https://juejin.im/post/5d0ba00af265da1bc7524043#heading-3)中的几个回答后，对我有很大的启发。在**对自己的技术方向、前景迷茫时、或者在埋怨自己的项目太low时、或者埋怨自己每天在做重复工作时、或者每天对层出不穷的新技术焦头烂额时**，不妨**认真的审视下自己的项目**，
+ 每天重复的工作，是不是可以自己造轮子了；
+ 技术栈太low，是不是可以平滑过渡到新技术，提高开发效率；
+ 学再多的新技术，最终也会回归并实践到项目中。

从**工作流程和项目的痛点**出发，**你会在实践、总结并解决实际问题中进步的更加迅速**。


---

> 写这篇文章的感受：**把这些东西表达出来的难度 `>>` 文章本身所包含的技术难度**