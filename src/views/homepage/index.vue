<template>
  <div class="page-wrapper">
    <el-scrollbar class="scrollbar-wrapper">
      <div class="content-wrapper">
        <div class="left-wrapper">
          <el-card class="carousel-card">
            <el-carousel height="400px">
              <el-carousel-item>
                <el-image style="width: 100%; height: 100%" :src="carousel1" />
              </el-carousel-item>
              <el-carousel-item>
                <el-image style="width: 100%; height: 100%" :src="carousel2" />
              </el-carousel-item>
              <el-carousel-item>
                <el-image style="width: 100%; height: 100%" :src="carousel3" />
              </el-carousel-item>
            </el-carousel>
          </el-card>
          <div class="subscription-wrapper">
            <div class="subscription-row">
              <SubscriptionCard
                label="记账本"
                :subscribed="ledgerSubscribed"
                @subscribe="ledgerSubscribe()"
                @unsubscribe="ledgerUnsubscribe()"
              />
              <SubscriptionCard label="待办任务" :subscribed="todolistSubscribed" />
              <SubscriptionCard label="密码本" :subscribed="codebookSubscribed" />
            </div>
          </div>
        </div>
        <div class="right-wrapper">
          <HelloCard />
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import carousel1 from '@/assets/img/carousel/carousel1.jpg'
import carousel2 from '@/assets/img/carousel/carousel2.jpg'
import carousel3 from '@/assets/img/carousel/carousel3.jpg'
import SubscriptionCard from './components/SubscriptionCard.vue'
import HelloCard from './components/HelloCard.vue'
import { ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { ElMessage } from 'element-plus'
import RoleConst from '@/constants/role_const'
import AuthorizationService from '@/services/authorization_service'
import API from '@/api'

const appStore = useAppStore()

const ledgerSubscribed = ref(false)
const todolistSubscribed = ref(false)
const codebookSubscribed = ref(false)

const initSubscribed = async () => {
  ledgerSubscribed.value = false

  if (!appStore.hasAuthorizations) {
    await AuthorizationService.updateAuthorizations()
  }
  const roles = appStore.authorizations.roles
  roles.forEach(item => {
    if (item === RoleConst.LEDGER_SUBSCRIBER) {
      ledgerSubscribed.value = true
    }
  })
}
initSubscribed()

const ledgerSubscribe = () => {
  API.ledger.basic
    .subscribe()
    .then(async res => {
      if (res && res.success) {
        console.log('订阅记账本服务成功')
        ElMessage.success('订阅成功')
        await AuthorizationService.updateAuthorizations()
        await initSubscribed()
      } else {
        if (res && res.message != null) {
          console.log('订阅记账本服务失败', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('订阅记账本服务失败')
          ElMessage.error('订阅失败')
        }
      }
    })
    .catch(error => {
      console.log(error.message)
      ElMessage.error(error.message)
    })
}
const ledgerUnsubscribe = () => {
  API.ledger.basic
    .unsubscribe()
    .then(async res => {
      if (res && res.success) {
        console.log('退订记账本服务成功')
        ElMessage.success('取消订阅成功')
        await AuthorizationService.updateAuthorizations()
        await initSubscribed()
      } else {
        if (res && res.message != null) {
          console.log('退订记账本服务失败', res.message)
          ElMessage.error(res.message)
        } else {
          console.log('退订记账本服务失败')
          ElMessage.error('取消订阅失败')
        }
      }
    })
    .catch(error => {
      console.log(error.message)
      ElMessage.error(error.message)
    })
}
</script>

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

      .left-wrapper {
        width: calc(70% - 5px);

        .carousel-card {
          .el-card__body {
            padding: 0px !important;
          }
        }

        .subscription-wrapper {
          width: 100%;

          .subscription-row {
            width: 100%;
            height: 100px;
            margin-top: 6px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
      }

      .right-wrapper {
        width: calc(30% - 5px);
        margin-left: 7px;
      }
    }
  }
}

// 待删除
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
