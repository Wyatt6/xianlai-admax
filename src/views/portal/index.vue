<template>
  <div class="page-wrapper">
    <el-card class="portal-card">
      <div class="half-box portal-cover" />
      <div class="half-box input-box">
        <router-view />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.page-wrapper {
  width: 100%;
  height: 100%;
  background-color: #f2f3f5;
  display: flex;
  align-items: center;
  justify-content: center;

  .portal-card {
    $--portal-card-width: 1000px;
    $--portal-card-height: 600px;

    width: $--portal-card-width;
    height: $--portal-card-height;
    border-radius: 0px;

    ::v-deep .el-card__body {
      width: 100%;
      height: 100%;
      padding: 0px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .half-box {
      width: 50%;
      height: 100%;
    }

    .portal-cover {
      background-image: url('@/assets/img/portal_cover.jpg');
      background-size: 100% 100%;
    }

    .input-box {
      $--input-box-padding: 60px;

      padding: $--input-box-padding;
      width: calc($--portal-card-width / 2 - 2 * $--input-box-padding);
      height: calc($--portal-card-height - 2 * $--input-box-padding);
    }
  }
}
</style>
