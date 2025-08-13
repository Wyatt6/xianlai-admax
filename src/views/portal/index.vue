<template>
  <div class="page-wrap">
    <el-card class="main-card">
      <div class="half-card cover-img">
        <div class="cover-text">
          <div class="cover-title">闲来 Admax</div>
          <div class="cover-subtitle">一款开源、轻量的后台管理系统</div>
        </div>
      </div>
      <div class="half-card input-box">
        <RouterView />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.page-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color-page);

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
      background-image: url('@/assets/images/portal-cover.jpg');
      background-size: 100% 100%;
      display: flex;
      justify-content: center;

      .cover-text {
        width: 80%;
        height: 10rem;
        margin-top: 9rem;
        cursor: default;

        .cover-title {
          font-size: 5rem;
          font-weight: 900;
          color: #ffffff;
        }

        .cover-subtitle {
          font-size: 2rem;
          color: #ffffff;
        }
      }
    }

    .input-box {
      $--input-box-padding: 7rem;
      padding: $--input-box-padding;
      width: calc($--main-card-width / 2 - 2 * $--input-box-padding);
      height: calc($--main-card-height - 2 * $--input-box-padding);
    }
  }
}
</style>
