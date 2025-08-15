<template>
  <div class="page-wrapper">
    <el-scrollbar class="scrollbar-wrapper">
      <div class="content-wrapper">
        数据看板
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scpoed>
.page-wrapper {
  width: 100%;
  height: 100%;

  .scrollbar-wrapper {
    ::v-deep .el-scrollbar__view {
      width: 100% !important;
    }

    .content-wrapper {
      width: 100%;
      min-height: 100%;
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
