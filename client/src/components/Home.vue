<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.jpg" />
        <span>OF-Explorer</span>
      </div>
      <el-divider direction="vertical"></el-divider>
      <el-menu
        mode="horizontal"
        background-color="#fff0"
        text-color="#fff"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/detect"
          >OCEAN FRONT DETECTION & FEATURES DERIVATION</el-menu-item
        >
        <el-menu-item index="0" disabled>·</el-menu-item>
        <el-menu-item index="/analysis"
          >VISUAL ANALYSIS OF OCEAN FRONT</el-menu-item
        >
      </el-menu>
    </el-header>
    <el-container class="main-container">
      <router-view></router-view>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #ccc;
  display: flex;
  padding-left: 0;
  align-items: center;
  color: #413c8c;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      width: 115px;
      margin: 0px 15px;
    }
    img {
      height: 75px;
      width: 75px;
    }
  }
  .el-divider--vertical {
    width: 2px;
    height: 1.5em;
  }
  .el-menu-item {
    font-size: 15px;
    font-weight: bold;
  }
  /* .el-menu--horizontal {
    border: 0;
  } */
  .el-menu-item.is-disabled {
    opacity: 1;
    cursor: default;
  }
}
.main-container {
  width: 100%;
  height: 850px;
}
</style>
