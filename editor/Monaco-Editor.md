## 什么是Monaco Editor？

微软之前有个项目叫做Monaco Workbench，后来这个项目变成了VSCode，而Monaco Editor（下文简称monaco）就是从这个项目中成长出来的一个web编辑器，他们很大一部分的代码（monaco-editor-core）都是共用的，所以monaco和VSCode在编辑代码，交互以及UI上几乎是一摸一样的，有点不同的是，两者的平台不一样，monaco基于浏览器，而VSCode基于electron，所以功能上VSCode更加健全，并且性能比较强大。



## 开始使用

本文是采用vue为基础开发web代码编辑器，所以以下都是基于vue来说明。



## 基本功能

1、安装monaco

```bash
npm i element-ui -S
npm i monaco-editor -S
npm i monaco-editor-webpack-plugin -S
```

2、配置vue.config.js

```js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
module.exports = {
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin(),
    ],
  },
};
```

3、建立公共组件monaco.vue

```vue
<template>
  <div ref="container" class="monaco-editor" :style="`height: ${height}px`"></div>
</template>
<script>
import * as monaco from 'monaco-editor'
export default {
  name: 'AcMonaco',
  props: {
    opts: {
      type: Object,
      default() {
        return {}
      }
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      // 主要配置
      defaultOpts: {
        value: '', // 编辑器的值
        theme: 'vs-dark', // 编辑器主题：vs, hc-black, or vs-dark，更多选择详见官网
        roundedSelection: false, // 右侧不显示编辑器预览框
        autoIndent: true // 自动缩进
      }
    }
  },
  watch: {
    opts: {
      handler(n) {
        this.init()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 初始化container的内容，销毁之前生成的编辑器
      this.$refs.container.innerHTML = ''

      this.editorOptions = Object.assign(this.defaultOpts, this.opts)
      // 生成编辑器对象
      this.monacoEditor = monaco.editor.create(this.$refs.container, this.editorOptions)
      // 编辑器内容发生改变时触发
      this.monacoEditor.onDidChangeModelContent(() => {
        this.$emit('change', this.monacoEditor.getValue())
      })
    },
    // 供父组件调用手动获取值
    getVal() {
      return this.monacoEditor.getValue()
    }
  }
}
</script>
```

4、父组件调用

```vue
<template>
    <div>
      语言：
      <el-select v-model="opts.language" clearable placeholder="请选择" size="mini" @change="changeLanguage">
        <el-option
          v-for="item in sets.language"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      样式风格：
      <el-select v-model="opts.theme" clearable placeholder="请选择" size="mini" @change="changeTheme">
        <el-option
          v-for="item in sets.theme"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-button type="primary" size="mini" @click="getValue">获取内容</el-button>
    </div>
    <!--调用子组件-->
    <monaco ref="monaco" :opts="opts" @change="changeValue"></monaco>
</template>
<script>
import monaco from '@/components/monaco'
export default {
    components: { monaco },
    data() {
      return {
        sets: {
          language: {
            'apex': 'apex',
            'azcli': 'azcli',
            'bat': 'bat',
            'c': 'c',
            'clojure': 'clojure',
            'coffeescript': 'coffeescript',
            'cpp': 'cpp',
            'csharp': 'csharp',
            'csp': 'csp',
            'css': 'css',
            'dockerfile': 'dockerfile',
            'fsharp': 'fsharp',
            'go': 'go',
            'graphql': 'graphql',
            'handlebars': 'handlebars',
            'html': 'html',
            'ini': 'ini',
            'java': 'java',
            'javascript': 'javascript',
            'json': 'json',
            'kotlin': 'kotlin',
            'less': 'less',
            'lua': 'lua',
            'markdown': 'markdown',
            'msdax': 'msdax',
            'mysql': 'mysql',
            'objective-c': 'objective-c',
            'pascal': 'pascal',
            'perl': 'perl',
            'pgsql': 'pgsql',
            'php': 'php',
            'plaintext': 'plaintext',
            'postiats': 'postiats',
            'powerquery': 'powerquery',
            'powershell': 'powershell',
            'pug': 'pug',
            'python': 'python',
            'r': 'r',
            'razor': 'razor',
            'redis': 'redis',
            'redshift': 'redshift',
            'ruby': 'ruby',
            'rust': 'rust',
            'sb': 'sb',
            'scheme': 'scheme',
            'scss': 'scss',
            'shell': 'shell',
            'sol': 'sol',
            'sql': 'sql',
            'st': 'st',
            'swift': 'swift',
            'tcl': 'tcl',
            'typescript': 'typescript',
            'vb': 'vb',
            'xml': 'xml',
            'yam': 'yam'
          },
          theme: {
            'vs': 'vs',
            'vs-dark': 'vs-dark',
            'hc-black': 'hc-black'
          }
        },
        opts: {
          value: '',
          readOnly: false, // 是否可编辑
          language: 'javascript', // 语言类型
          theme: 'vs-dark' // 编辑器主题
        }
      }
    },
    methods: {
      changeLanguage(val) {
        this.opts.language = val
      },
      changeTheme(val) {
        this.opts.theme = val
      },
      // 手动获取值
      getValue() {
        this.$message.info(this.$refs.monaco.getVal())
      },
      // 内容改变自动获取值
      changeValue(val) {
        console.log(val)
      }
    }
}
</script>
```







































