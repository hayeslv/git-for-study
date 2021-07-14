// 当webpack遇到.vue的文件，这个shims文件会帮助它理解成vue的组件
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>
  export default component
}