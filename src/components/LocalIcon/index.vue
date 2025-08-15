<template>
  <SvgIcon v-if="svgCode.length > 0" :src="svgCode" color-transition="0s" />
</template>

<script setup>
/**
 * 本地图标组件
 *
 * 基于 vite-awesome-svg-loader 插件中的 SvgIcon 组件，通过图标名称来使用本地图标
 * 图标 svg 文件保存于 /src/assets/icons 目录下
 * 组件属性：
 *   - name             图标名称（不用带 .svg 后缀）
 *   - color            继承自 SvgIcon，控制图标颜色
 *   - colorTransition  继承自 SvgIcon，控制图标颜色切换动画
 *   - size             继承自 SvgIcon，控制图标尺寸
 *   - src              继承自 SvgIcon（在本组件没有用）
 */
import { ref, watch } from 'vue'
import { SvgIcon } from 'vite-awesome-svg-loader/vue-integration'

const svgCode = ref('')

const props = defineProps({
  // 不需要这样引入，也能直接用SvgIcon自带的color等属性
  // ...SvgIcon.props,
  name: {
    type: String,
    required: true
  }
})

/**
 * 图标名称变更时的处理
 * 通过正则表达式判断目标图标文件，并解出 svg 代码赋值给 svgCode 进行渲染
 *
 * @param name 图标名称
 */
function onNameChange(name) {
  const icons = this.$localIcons
  for (const path in icons) {
    if (key === name) {
      svgCode.value = icons[key]
      break
    }
  }
}

/**
 * 监听图标名称变动，达到动态变更效果
 */
watch(
  () => props.name,
  (value, oldValue) => onNameChange(value),
  { immediate: true }
)
</script>
