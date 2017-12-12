# debug文档翻译
[![Build Status](https://travis-ci.org/visionmedia/debug.svg?branch=master)](https://travis-ci.org/visionmedia/debug)  [![Coverage Status](https://coveralls.io/repos/github/visionmedia/debug/badge.svg?branch=master)](https://coveralls.io/github/visionmedia/debug?branch=master)  [![Slack](https://visionmedia-community-slackin.now.sh/badge.svg)](https://visionmedia-community-slackin.now.sh/) [![OpenCollective](https://opencollective.com/debug/backers/badge.svg)](#backers)
[![OpenCollective](https://opencollective.com/debug/sponsors/badge.svg)](#sponsors)

<img width="647" src="https://user-images.githubusercontent.com/71256/29091486-fa38524c-7c37-11e7-895f-e7ec8e1039b6.png">

一个小的JavaScript调试工具仿照Node.js核心的调试技术。基于Node.js和Web浏览器。

## 安装

```bash
$ npm install debug
```

## 使用

`debug` 公开一个函数；只需将此函数传递给模块的名称，它将返回一个装饰版本的 `console.error` 以便将调试语句传递。这将允许您为模块的不同部分和整个模块切换调试输出。

举例 [_app.js_](./examples/node/app.js):

```js
var debug = require('debug')('http')
  , http = require('http')
  , name = 'My App';

// fake app

debug('booting %o', name);

http.createServer(function(req, res){
  debug(req.method + ' ' + req.url);
  res.end('hello\n');
}).listen(3000, function(){
  debug('listening');
});

// fake worker of some kind

require('./worker');
```

举例 [_worker.js_](./examples/node/worker.js):

```js
var a = require('debug')('worker:a')
  , b = require('debug')('worker:b');

function work() {
  a('doing lots of uninteresting work');
  setTimeout(work, Math.random() * 1000);
}

work();

function workb() {
  b('doing some work');
  setTimeout(workb, Math.random() * 2000);
}

workb();
```

使用 `DEBUG` 环境变量来启用基于空间或
逗号分隔的名称。

这是一些例子:

<img width="647" alt="screen shot 2017-08-08 at 12 53 04 pm" src="https://user-images.githubusercontent.com/71256/29091703-a6302cdc-7c38-11e7-8304-7c0b3bc600cd.png">
<img width="647" alt="screen shot 2017-08-08 at 12 53 38 pm" src="https://user-images.githubusercontent.com/71256/29091700-a62a6888-7c38-11e7-800b-db911291ca2b.png">
<img width="647" alt="screen shot 2017-08-08 at 12 53 25 pm" src="https://user-images.githubusercontent.com/71256/29091701-a62ea114-7c38-11e7-826a-2692bedca740.png">

#### Windows窗口

在Windows环境下变量设置使用 `set` 命令。

```cmd
set DEBUG=*,-not_this
```

注意，PowerShell使用不同的语法来设置变量。

```cmd
$env:DEBUG = "*,-not_this"
```

然后，像往常一样运行调试程序。


## 命名空间的颜色

每个调试实例都有一个基于它的命名空间名称生成的颜色。
这有助于在视觉上分析调试输出，以确定调试行属于哪一个调试实例。

#### Node.js

在Node.js中, 当stderr是一个TTY时，颜色模块启动。 你也应该安装 [`supports-color`](https://npmjs.org/supports-color) 从旁调试,
否则调试只会使用少量的基本颜色。

<img width="521" src="https://user-images.githubusercontent.com/71256/29092181-47f6a9e6-7c3a-11e7-9a14-1928d8a711cd.png">

#### Web浏览器

在选用`%c`格式后，颜色模块也可以在"Web Inspectors"中适用。


<img width="524" src="https://user-images.githubusercontent.com/71256/29092033-b65f9f2e-7c39-11e7-8e32-f6f0d8e865c1.png">


## 毫秒的差异
在积极开发一个应用程序时，看看一次`debug()`通话和下一次通话之间的时间是非常有用的。例如，假设你 `debug()`在请求一个资源之前调用，之后"+NNNms"将显示你在多次调用之间花了多少时间

<img width="647" src="https://user-images.githubusercontent.com/71256/29091486-fa38524c-7c37-11e7-895f-e7ec8e1039b6.png">

当stdout不是TTY时, `Date#toISOString()`使用它，使得它更加有用地记录调试信息，如下所示：

<img width="647" src="https://user-images.githubusercontent.com/71256/29091956-6bd78372-7c39-11e7-8c55-c948396d6edd.png">


## 约定

如果您在一个或多个库中使用这个库，则应该使用库的名称，以便开发人员可以根据需要切换调试，而不用猜测名称。如果你有多个调试器，你应该在它们前加上库名，并用“：”来分隔特性。例如Connect中的“bodyParser”就是“connect：bodyParser”。如果在名称末尾附加“*”，则不管DEBUG环境变量的设置如何，都将始终启用它。然后，您可以将其用于正常输出以及调试输出。

## 通配符

 `*` 字符可以用作通配符。假设你的库有一个名为 "connect:bodyParser", "connect:compress", "connect:session",的调试器，而不是列出所有三个 
`DEBUG=connect:bodyParser,connect:compress,connect:session`, 你可以简单的做
`DEBUG=connect:*`,或者使用这个模块来运行一切 `DEBUG=*`.

您也可以通过给它们加一个“ - ”字符来排除特定的调试器。例如， `DEBUG=*,-connect:*` 将包括除了以“connect：”开头的所有调试器。

## 环境变量

在运行Node.js时，可以设置一些环境变量来改变调试日志的行为：

| 名字      | 作用                                         |
|-----------|-------------------------------------------------|
| `DEBUG`   |  启用/禁用特定的调试命名空间。 |
| `DEBUG_HIDE_DATE` | 隐藏调试输出的日期（非TTY）。  |
| `DEBUG_COLORS`| 是否在调试输出中使用颜色。 |
| `DEBUG_DEPTH` | 对象检查深度。                    |
| `DEBUG_SHOW_HIDDEN` | 显示检查对象的隐藏属性。 |


__注意:__ 环境变量 `DEBUG_` 最终将被转换为一个Options对象，并与 `%o`/`%O`一起使用。
有关
[`util.inspect()`](https://nodejs.org/api/util.html#util_util_inspect_object_options)
完整列表，请参阅Node.js文档 。

## 格式化程序

调试使用 [printf-style](https://wikipedia.org/wiki/Printf_format_string) 样式的格式。以下是官方支持的格式化程序：

| 格式化程序 | 说明 |
|-----------|----------------|
| `%O`      | 在多行打印一个对象。 |
| `%o`      | 在一行打印一个对象。 |
| `%s`      | 字符串 |
| `%d`      | 数字（整数和浮点数）|
| `%j`      | JSON。如果参数包含循环引用，则替换为字符串“[Circular]”。|
| `%%`      | 单一百分号（'％'）。这不会消耗一个参数。 |


### 自定义格式化程序

您可以通过扩展 `debug.formatters` 对象来添加自定义格式器。
例如，如果您想添加对以十六进制渲染缓冲区的支持 `%h`，则可以执行如下操作：

```js
const createDebug = require('debug')
createDebug.formatters.h = (v) => {
  return v.toString('hex')
}

// …elsewhere
const debug = createDebug('foo')
debug('this is hex: %h', new Buffer('hello world'))
//   foo this is hex: 68656c6c6f20776f726c6421 +0ms
```


## 浏览器支持
您可以使用 [browserify](https://github.com/substack/node-browserify),
构建一个浏览器就绪的脚本，或者只是使用[browserify-as-a-service](https://wzrd.in/) [build](https://wzrd.in/standalone/debug@latest),
构建，如果您不想自己构建它的话。

调试的启用状态当前被保存 `localStorage`.
考虑下面，你必须所示的情况 `worker:a` and `worker:b`,
，并希望同时调试。你可以使用 `localStorage.debug` 等以下命令启用它:

```js
localStorage.debug = 'worker:*'
```

然后刷新页面。

```js
a = debug('worker:a');
b = debug('worker:b');

setInterval(function(){
  a('doing some work');
}, 1000);

setInterval(function(){
  b('doing some work');
}, 1200);
```


## 输出流

  默认情况下`debug`会记录到stderr，但是可以通过重写`log`方法来配置每个命名空间：

例如 [_stdout.js_](./examples/node/stdout.js):

```js
var debug = require('debug');
var error = debug('app:error');

// by default stderr is used
error('goes to stderr!');

var log = debug('app:log');
// set this namespace to log via console.log
log.log = console.log.bind(console); // don't forget to bind to console!
log('goes to stdout');
error('still goes to stderr!');

// set all output to go via console.info
// overrides all per-namespace log settings
debug.log = console.info.bind(console);
error('now goes to stdout via console.info');
log('still goes to stdout, but via console.info now');
```

## 动态设置

您也可以通过调用`enable()`方法来动态启用调试：

```js
let debug = require('debug');

console.log(1, debug.enabled('test'));

debug.enable('test');
console.log(2, debug.enabled('test'));

debug.disable();
console.log(3, debug.enabled('test'));

```

打印： 
```
1 false
2 true
3 false
```

用法：  
`enable(namespaces)`  
`namespaces` 可以包含由冒号和通配符分隔的模式。   
请注意，调用`enable()`完全覆盖以前设置的DEBUG变量： 

```
$ DEBUG=foo node -e 'var dbg = require("debug"); dbg.enable("bar"); console.log(dbg.enabled("foo"))'
=> false
```

## 检查调试目标是否被启用

创建调试实例之后，可以通过检查`enabled`属性来确定是否启用了调试实例：

```javascript
const debug = require('debug')('http');

if (debug.enabled) {
  // do stuff...
}
```

您也可以手动切换此属性以强制启用或禁用调试实例。
