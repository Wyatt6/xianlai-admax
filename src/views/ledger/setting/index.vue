<template>
  <div class="page-wrapper">
    <div class="card-wrapper">
      <el-card class="card" shadow="never">
        <el-tabs class="tabs" tab-position="left">
          <el-tab-pane :lazy="true">
            <template #label>
              <svg-icon class="tab-pane-icon" icon="ri-shopping-cart-2-line" />
              <span class="tab-pane-label">记账类别</span>
            </template>
            <Category />
          </el-tab-pane>
          <el-tab-pane :lazy="true">
            <template #label>
              <svg-icon class="tab-pane-icon" icon="ri-bank-card-2-line" />
              <span class="tab-pane-label">动账渠道</span>
            </template>
            <Channel />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import Channel from './channel/index.vue'
import Category from './category/index.vue'
</script>

<style lang="scss" scpoed>
.page-wrapper {
  width: 100%;
  height: 100%;

  .card-wrapper {
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;

    .card {
      width: calc(100% - 2px);
      min-height: calc(100% - 2px);
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;

      .el-card__body {
        height: calc(100% - 2 * var(--el-card-padding)) !important;

        .tabs {
          height: 100%;

          .el-tabs__content {
            height: 100%;

            .el-tab-pane {
              height: 100%;
            }
          }

          .tab-pane-icon {
            $--tab-pane-icon-size: 20px;
            width: $--tab-pane-icon-size;
            height: $--tab-pane-icon-size;
          }

          .tab-pane-label {
            font-size: 14px;
            font-weight: bold;
            margin-left: 8px;
          }
        }
      }
    }
  }
}
</style>
