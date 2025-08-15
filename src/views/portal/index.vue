<template>
  <div class="page-wrap">
    <div class="card-wrap">
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
    <div class="footer">
      <span>
        Copyright &copy; 2025-2025 XianLai.fun 闲来. All rights reserved.&nbsp;
        <a target="_blank" href="https://beian.miit.gov.cn/">粤ICP备XXXXXXXX号</a>&nbsp;
        <a target="_blank" href="https://beian.mps.gov.cn/">粤公网安备XXXXXXXX号</a>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-wrap {
  width: 100%;
  height: 100%;
  background-color: var(--el-bg-color-page);
  $--footer-height: 4rem;

  .card-wrap {
    width: 100%;
    height: 100%;
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
        background-image: url('@/assets/img/portal-cover.jpg');
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

  .footer {
    width: 100%;
    height: $--footer-height;
    margin-top: -$--footer-height;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
  }
}
</style>
