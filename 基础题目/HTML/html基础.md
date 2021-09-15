## 1、doctype（文档类型）的作用是什么？

​		DOCTYPE是html5标准网页声明，且必须声明在HTML文档的第一行。来告知浏览器的解析器用什么文档标准解析这个文档，不同的渲染模式会影响到浏览器对于CSS代码甚至Javascript脚本的解析。

文档解析类型有：

- BackCompat： 怪异模式， 浏览器使⽤⾃⼰的怪异模式解析渲染⻚⾯。 （如果没有声明DOCTYPE， 默认就是这个模式）
- CSS1Compat： 标准模式， 浏览器使⽤W3C的标准解析渲染⻚⾯。  



## 2、这三种模式的区别是什么？（接上一问）

- 标准模式(standards mode)： ⻚⾯按照 HTML 与 CSS 的定义渲染  
- 怪异模式(quirks mode)模式： 会模拟更旧的浏览器的⾏为  
- 近乎标准(almost standards)模式： 会实施了⼀种表单元格尺⼨的怪异⾏为（与IE7之前的单元格布局⽅式⼀致），除此之外符合标准定义  



## 3、HTML、XML和XHTML有什么区别？

- HTML(超⽂本标记语⾔): 在html4.0之前HTML先有实现再有标准， 导致HTML⾮常混乱和松散  
- XML(可扩展标记语⾔): 主要⽤于存储数据和结构， 可扩展， ⼤家熟悉的JSON也是相似的作⽤， 但是更加轻量⾼效， 所以XML现在市场越来越⼩了  
- XHTML(可扩展超⽂本标记语⾔): 基于上⾯两者⽽来， W3C为了解决HTML混乱问题⽽⽣， 并基于此诞⽣了HTML5， 开头加⼊ <!DOCTYPE html> 的做法因此⽽来， 如果不加就是兼容混乱的HTML， 加了就是标准模式。  



## 4、什么是data-属性？

HTML的数据属性， ⽤于将数据储存于标准的HTML元素中作为额外信息,我们可以通过js访问并操作它， 来达到操作数据的⽬的。  

```html
<article
  id="electriccars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
  ...
</article>
```

> 前端框架出现之后， 这种⽅法已经不流⾏了  



## 5、你对HTML语义化的理解？

语义化是指使⽤恰当语义的html标签， 让⻚⾯具有良好的结构与含义， ⽐如 <p> 标签就代表段落， <article> 代表正⽂内容等等。  

语义化的好处主要有两点：  

- 开发者友好： 使⽤语义类标签增强了可读性， 开发者也能够清晰地看出⽹⻚的结构， 也更为便于团队的开发和维护  
- 机器友好： 带有语义的⽂字表现⼒丰富， 更适合搜索引擎的爬⾍爬取有效信息， 语义类还可以⽀持读屏软件， 根据⽂章可以⾃动⽣成⽬录  



## 6、有哪些常用的meta标签？

meta标签由name和content两个属性来定义， 来描述⼀个HTML⽹⻚⽂档的属性， 例如作者、 ⽇ 期和时间、 ⽹⻚描述、关键词、 ⻚⾯刷新等， 除了⼀些http标准规定了⼀些name作为⼤家使⽤的共识， 开发者也可以⾃定义name。  

- charset， ⽤于描述HTML⽂档的编码形式  

```html
<meta charset="UTF-8" > 
```

- http-equiv， 顾名思义， 相当于http的⽂件头作⽤,⽐如下⾯的代码就可以设置http的缓存过期⽇ 期  

```html
<meta http-equiv="expires" content="Wed, 20 Jun 2019 22:33:00 GMT">
```

- viewport， 移动前端最熟悉不过， Web开发⼈员可以控制视⼝ 的⼤⼩和⽐例  

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
```

 

## 7、src和href的区别？

- src是指向外部资源的位置， 指向的内容会嵌⼊到⽂档中当前标签所在的位置， 在请求src资源时会将其指向的资源下载并应⽤到⽂档内， 如js脚本， img图⽚和frame等元素。 当浏览器解析到该元素时， 会暂停其他资源的下载和处理， 知道将该资源加载、 编译、 执⾏完毕， 所以⼀般js脚本会放在底部⽽不是头部。  
- href是指向⽹络资源所在位置（的超链接） ， ⽤来建⽴和当前元素或⽂档之间的连接， 当浏览器识别到它他指向的⽂件时， 就会并⾏下载资源， 不会停⽌对当前⽂档的处理。  



## 8、知道img的srcset的作用是什么吗？（追问）

可以设计响应式图⽚， 我们可以使⽤两个新的属性srcset 和 sizes来提供更多额外的资源图像和提示， 帮助浏览器选择正确的⼀个资源。  

srcset 定义了我们允许浏览器选择的图像集， 以及每个图像的大小。

sizes 定义了⼀组媒体条件（例如屏幕宽度） 并且指明当某些媒体条件为真时， 什么样的图⽚尺⼨是最佳选择。  

所以， 有了这些属性， 浏览器会：  

- 查看设备宽度
- 检查sizes列表中那个媒体条件是第一个为真
- 查看给予该媒体查询的槽大小
- 加载 srcset 列表中引⽤的最接近所选的槽⼤⼩的图像  

> srcset提供了根据屏幕条件选取图⽚的能力

```html
<img src="clock-demo-thumb-200.png"
  alt="Clock"
  srcset="clock-demo-thumb-200.png 200w,
  clock-demo-thumb-400.png 400w"
  sizes="(min-width: 600px) 200px, 50vw">
```



## 9、还有哪一个标签能起到跟srcset相似作用？（追问）

`<picture>` 元素通过包含零或多个 `<source>` 元素和⼀个 `<img>` 元素来为不同的显示/设备场景提供图像版本。 浏览器会选择最匹配的⼦ `<source>` 元素， 如果没有匹配的， 就选择 `<img>` 元素的 src 属性中的URL。 然后， 所选图像呈现在 `<img>` 元素占据的空间中

> picture同样可以通过不同设备来匹配不同的图像资源

```html
<picture>
  <source srcset="/media/examples/surfer-240-200.jpg" media="(min-width: 800px)">
	<img src="/media/examples/painted-hand-298-332.jpg" />
</picture>
```



## 10、script标签中defer和async的区别？

- defer： 浏览器指示脚本在⽂档被解析后执⾏， script被异步加载后并不会⽴刻执⾏， ⽽是等待⽂档被解析完毕后执⾏。 
- async： 同样是异步加载脚本， 区别是脚本加载完毕后⽴即执⾏， 这导致async属性下的脚本是乱序的， 对于script有先后依赖关系的情况， 并不适⽤。  



## 11、有几种前端存储的方式？

cookies、 localstorage、 sessionstorage、 Web SQL、 IndexedDB  



## 12、这些方式的区别是什么？（追问）

- cookies： 在HTML5标准前本地储存的主要⽅式， 优点是兼容性好， 请求头⾃ 带cookie⽅便， 缺点是⼤⼩只有4k，⾃动请求头加⼊cookie浪费流量， 每个domain限制20个cookie， 使⽤起来麻烦需要⾃⾏封装  
- localStorage： HTML5加⼊的以键值对(Key-Value)为标准的⽅式， 优点是操作⽅便， 永久性储存（除⾮⼿动删除） ， ⼤⼩为5M， 兼容IE8+  
- sessionStorage： 与localStorage基本类似， 区别是sessionStorage当⻚⾯关闭后会被清理， ⽽且与cookie、localStorage不同， 他不能在所有同源窗⼝中共享， 是会话级别的储存⽅式  
- Web SQL： 2010年被W3C废弃的本地数据库数据存储⽅案， 但是主流浏览器（⽕狐除外） 都已经有了相关的实现， web sql类似于SQLite， 是真正意义上的关系型数据库， ⽤sql进⾏操作， 当我们⽤JavaScript时要进⾏转换，较为繁琐。  
- IndexedDB： 是被正式纳⼊HTML5标准的数据库储存⽅案， 它是NoSQL数据库， ⽤键值对进⾏储存， 可以进⾏快速读取操作， ⾮常适合web场景， 同时⽤JavaScript进⾏操作会⾮常⽅便。  

















































