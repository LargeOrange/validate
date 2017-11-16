# AJKModel使用文档

## 安装引入AJKModel

安装

```
npm install @aijiakan/AJKModel
```

引入

```
let AJKModel = require('../node_modules/@aijiakang/AJKModel');
```


## schema

使用AJKModel进行校验是需要声明一个schema，也就是用来校验的规则。
下面是一个简单的例子

```
let schema = {
                name: {type: 'string', required: true,},
                email: {type: 'string', required: true,},
                address: {
                    street: {type: 'string', required: true,},
                    city: {type: 'string', required: true,}
                },
            };

```

这个就是申明一个schema规定了输入数据规则，这个schema规定输入数据必须满足

1：输入数据的字段只能在name，email，address，address.street，address.city中，不能出现其他字段

2：输入数据的字段必须满足schema中规定的条件，比如name类型必须是string，而且不可缺失

### schema rule 参数说明

#### type：规定参数的类型

现在支持可填参数:

* number（纯数字的字符串/数字，整型, ***纯数字的字符串最大长度2147483647（js能支持的理论上string最大长度）***
* string（字符串，***长度不能超过2147483647(js支持的string最大理论长度)*** ）
* array 数组
	* 1：arrayRules可以为空
	* 2：数组里面的元素必须满足arrayRules，当数组是空数组的时候arrayRules的校验返回的是true


#### 其他可选参数


1. required（是否必须存在，默认true，传入的值不是bool类型报错）
2. min（传入最小值，min的参数只能是纯数字，inputObj对应字段的值可以是纯数字的字符串）
3. max（传入最大值，max的参数只能是纯数字，inputObj对应字段的值可以是纯数字的字符串）
4. allow（限定值只能是数组里面的值，所以传入allow的参数必须是数组）
	* 比如： {a: allow:[1,2,3,4]}, 表示 a的值只能和[1,2,3,4]这个数组里面的元素相等
	* allow传入的值不是数组会报错
5. length 限定输入参数的长度，现在针对字符串和数组。 length传入参数是数组，只能输入两种情况：
   * [?] ：[?]表示规定长度，如[10]，表示长度必须是10。
   * [?, ?]:表示长度在一个范围内（闭区间）；如[2,10]表示长度>=2 且 <= 10。
   * ?表示>=0的整型数字


***ihRule的参数中除了TS其他都先定了输入参数类型是string，使用时可以不用type限制***

### 相对复杂schema的例子和说明

#### 包含数组的schema

##### 例子

```
let schema = {
                name: {type: 'string', required: true,},
                email: {type: 'array', arrayRules : {type: string},
                address: {
                    type: 'array',
                    arrayRules : {
                    	street: {type: 'string', required: true,},
                    	city: {type: 'string', required: false,}
                    }
                },
            };

```

##### 说明

这个schema里面email和address是数组

email中type表明这个字段是个数组，arrayRules表明这个数组元素的规则，email这种写法表明是email是由字符串组成的数组,数组成员是字符串

address的arrayRules表明数组里面的每个成员是object/Json，且每个成员必须都有street，但是city值可以为空


## 校验

### 使用说明

调用AJKModel的validate方法，将规定好的schema和传入的参数inputObj传入validate方法中

```
let res = AJKModel.validate(schema, inputObj)
```

### 返回结果说明

返回结果res 是一个object有两个参数 code， message

当校验通过时 code = '100', message 没有

当校验发现不匹配时， code = '4000', message 是一个包含错误信息的字符串，通过JSON.parse解析后可以更清楚的看到那里有错



## 一个完整的例子


```
let AJKModel = require('../node_modules/@aijiakang/AJKModel');

let schema = {
                name: {type: 'string', required: true,},
                email: {type: 'string', required: true,},
                address: {
                    street: {type: 'string', required: true,},
                    city: {type: 'string', required: true,}
                },
            };
            
let inputObj = {
                name: '123',
                email:'1231',
                address:{
                    street: 'adsa',
                    city: 'BJ'
                }
            };

let res = AJKModel.validate(schema, inputObj);

res.code == 100  // ture
```




















