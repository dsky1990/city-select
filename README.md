# city-select

## 省市区选择
这是一个简单的时间选择插件，只需要在需要显示input上加上`citySelector`这个calss就行了

```html
<input type="text" class="citySelector" value="" readonly="" name="citySelector" >
```
操作预览如下，可以选择省市区并tab切换到对应的列表：

![操作预览](http://7xl2p7.com1.z0.glb.clouddn.com/city-select.gif)


## 根据区级id得到省市区完整信息

这里拓展了jquery的方法，实现了根据区级id获得省市区完整信息的方法

```js
$('#test').setInputValue(120101); // 天津 - 天津 - 和平
```