import { defineStore } from 'pinia'
import { ref } from 'vue'
import RouteConst from '@/constants/route_const'
import Storage from '@/utils/storage'

const SIDEBAR_EXPAND = 'sidebarExpand'
const TAG_LIST = 'tagList'

export const useLayoutStore = defineStore('layout', () => {
  const sidebarExpand = ref(Storage.get(SIDEBAR_EXPAND) == null ? true : Storage.get(SIDEBAR_EXPAND))
  const tagList = ref(Storage.get(TAG_LIST) || [])

  // 切换菜单栏伸缩状态
  function changeSidebarExpand() {
    sidebarExpand.value = !sidebarExpand.value
    Storage.set(SIDEBAR_EXPAND, sidebarExpand.value) // 记住菜单展开/收起状态
  }

  /**
   * 添加新的页面标签数据到缓存中的页面标签列表中
   * @param {fullPath, meta, name, params, path, query, title} tag
   */
  function addTag(tag) {
    const isFind = tagList.value.find(item => {
      return item.path === tag.path
    })
    if (!isFind) {
      tagList.value.push(tag)
    }
    Storage.set(TAG_LIST, tagList.value)
  }

  /**
   * 删除一个或多个页面标签
   * @param {mode: 'other'||'right'||'index', index} payload 参数对象，包含mode和index（可选）属性
   */
  async function removeTags(payload) {
    const mode = payload.mode
    const index = payload.index
    if (mode === 'index') {
      tagList.value.splice(index, 1)
    } else if (mode === 'all') {
      let tagIndex = -1
      for (let i = 0; i < tagList.value.length; i++) {
        if (tagList.value[i].fullPath === RouteConst.INDEX) {
          tagIndex = i
          break
        }
      }
      if (tagIndex === -1) {
        tagList.value = []
      } else {
        tagList.value.splice(tagIndex + 1, tagList.value.length - tagIndex + 1)
        tagList.value.splice(0, tagIndex)
      }
    } else if (mode === 'other') {
      tagList.value.splice(index + 1, tagList.value.length - index + 1)
      tagList.value.splice(0, index)
    } else if (mode === 'right') {
      tagList.value.splice(index + 1, tagList.value.length - index + 1)
    }
    Storage.set(TAG_LIST, tagList.value)
  }

  // 初始化state状态
  function initState(state) {
    sidebarExpand.value = true
    tagList.value = []
  }

  return {
    sidebarExpand,
    tagList,
    changeSidebarExpand,
    addTag,
    removeTags,
    initState
  }
})
