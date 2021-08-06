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