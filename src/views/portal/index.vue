<template>
  <div class="page-wrap">
    <el-card class="main-card">
      <div class="half-card cover-img">
        <div class="cover-text">
          <div class="cover-title">{{ coverTitle }}</div>
          <div class="cover-subtitle">{{ coverSubTitle }}</div>
        </div>
      </div>
      <div class="half-card input-box">
        <RouterView />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useOptionStore } from '@/options'
import { ref } from 'vue'

const Options = useOptionStore()

const coverImage = ref()
function initCoverImage() {
  const type = Options.data.portal.coverImageType
  let coverUrl
  if (type === 'web') {
    coverImage.value = `url(${Options.data.portal.coverImagePath})`
  } else if (type === 'upload') {
    // TODO 用上传的图片做门户封面
  } else if (type === 'local') {
    coverUrl = new URL('/', import.meta.url)
    coverUrl.pathname = Options.data.portal.coverImagePath
    coverImage.value = `url(${coverUrl})`
  } else {
    coverImage.value = `url(/src/assets/images/portal/default-cover.jpg)`
  }
}
initCoverImage()

const coverTitle = ref(Options.data.portal.coverTitle)
const coverTitleSize = ref(`${Options.data.portal.coverTitleSize}rem`)
const coverTitleColor = ref(Options.data.portal.coverTitleColor)
const coverSubTitle = ref(Options.data.portal.coverSubTitle)
const coverSubTitleSize = ref(`${Options.data.portal.coverSubTitleSize}rem`)
const coverSubTitleColor = ref(Options.data.portal.coverSubTitleColor)
</script>

<style lang="scss" scoped>
.page-wrap {
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color-page);
  display: flex;
  align-items: center;
  justify-content: center;

  .main-card {
    $--main-card-width: 100rem;
    $--main-card-height: 60rem;
    width: $--main-card-width;
    height: $--main-card-height;
    border-radius: 0;

    :deep(.el-card__body) {
      width: 100%;
      height: 100%;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .half-card {
      width: 50%;
      height: 100%;
    }

    .cover-img {
      background-image: v-bind(coverImage);
      background-size: 100% 100%;
      display: flex;
      justify-content: center;

      .cover-text {
        width: 80%;
        height: 10rem;
        margin-top: 5rem;
        cursor: default;

        .cover-title {
          font-size: v-bind(coverTitleSize);
          color: v-bind(coverTitleColor);
        }

        .cover-subtitle {
          font-size: v-bind(coverSubTitleSize);
          color: v-bind(coverSubTitleColor);
        }
      }
    }

    .input-box {
      $--input-box-padding: 6rem;
      padding: $--input-box-padding;
      width: calc($--main-card-width / 2 - 2 * $--input-box-padding);
      height: calc($--main-card-height - 2 * $--input-box-padding);
    }
  }
}
</style>
