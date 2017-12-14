/**
 * Module dependencies. 模块依赖
 */
//终端  tty 模块提供了 tty.ReadStream 类和 tty.WriteStream 类。
//实用工具   util 模块主要用于支持 Node.js 内部 API 的需求。 大部分实用工具也可用于应用程序与模块开发者
var tty = require('tty');
var util = require('util');

/**
 * This is the Node.js implementation of `debug()`. 利用node.js实现debug() 
 */
//exports 变量是在模块的文件级别作用域内有效的，它在模块被执行前被赋予 module.exports 的值。

exports.init = init;

//用指定的参数调用'util.format()'，并写入错误流中
exports.log = log;

//带色彩打印消息
exports.formatArgs = formatArgs;

//更新process.env.debug环境变量,节省命名空间
exports.save = save;

//待测试的模块通过环境变DEBUG量赋值,加载命名空间
exports.load = load;

//是否开启带颜色打印消息
exports.useColors = useColors;

/**
 * Colors.
 */
//颜色码
exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {  //正常执行
  var supportsColor = require('supports-color');
  if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {  //可能出错的内容
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
  // 我们只关心`support-color`是否可用。 
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *从环境变量建立默认的 'inspect0pts'对象
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */
//建立默认的inspect0pts对象
exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case 驼峰式
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value  强制字符串值为js值
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`. 输出一个tty， 在颜色输出为真时启用
 */
//是否开启带颜色输出
function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled. 如果启用，则添加ANSI颜色转义代码
 *
 * @api public
 */
//带色彩打印消息
function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 * 用指定的参数调用'util.format()'，并写入错误流中
 */
//
function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`. 保存'namespaces'
 *
 * @param {String} namespaces   参数  {String}
 * @api private
 */
//更新process.env.debug环境变量,节省命名空间
function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the 如果你设定了一个process.env场无效或未定义，它被转换为
    // string 'null' or 'undefined'. Just delete instead.                       字符串'null' 或者 'undefined' 。 只删除
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes 返回以前运行的debug模式
 * @api private
 */
//待测试的模块通过环境变debug量赋值,加载命名空间
function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.  debug实例的开始逻辑
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */
//创建一个新的 'inspectOpts'对象以防止'useColor'与建立的'debug'情况不同
function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}
//这里正式将上面的所有方法都包转给debug 类  然后 相当于 每一次创建debug 实例的时候 都会进行一次对 stderr的包装
module.exports = require('./common')(exports);

var formatters = module.exports.formatters;
//定义打印方式
/**
 * Map %o to `util.inspect()`, all on a single line.
 */
//在一行打印
formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .replace(/\s*\n\s*/g, ' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */
//在多行打印
formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};
