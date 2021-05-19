<template>
  <div class="welcome-container">
    <!-- 欢迎文字 -->
    <div class="wavy">
      <span style="--i: 1">W</span>
      <span style="--i: 2">E</span>
      <span style="--i: 3">L</span>
      <span style="--i: 4">C</span>
      <span style="--i: 5">O</span>
      <span style="--i: 6">M</span>
      <span style="--i: 7">E</span>
      <span style="--i: 8">!</span>
    </div>
    <div class="tips-div">
      <span>Select the operation from the top menu...</span>
    </div>
    <!-- 水波纹 -->
    <section>
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
      <div class="wave wave4"></div>
    </section>
  </div>
</template>

<script>
export default {
  components: {},
  props: [],
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
@keyframes wavy-animate {
  0% {
    transform: translateY(0px);
  }
  20% {
    transform: translateY(-24px);
  }
  40%,
  100% {
    transform: translateY(0px);
  }
}

@keyframes wave-animate1 {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: 1000px;
  }
}
@keyframes wave-animate2 {
  0% {
    background-position-x: 0;
  }
  100% {
    background-position-x: -1000px;
  }
}

.welcome-container {
  width: 100%;
  background: #3586ff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 1px;
}

.wavy {
  margin-top: 300px;
  position: relative;
  -webkit-box-reflect: below -12px linear-gradient(transparent, rgba(0, 0, 0, 0.2));
}
.wavy span {
  position: relative;
  display: inline-block;
  color: #fff;
  font-size: 2em;
  animation: wavy-animate 1s ease-in-out infinite;
  animation-delay: calc(0.1s * var(--i));
}

.tips-div {
  margin-top: 350px;
  color: #ccc;
}

section {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
}
section .wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: url('../assets/wave.png');
  background-size: 1000px 100px;
}

section .wave.wave1 {
  animation: wave-animate1 30s linear infinite;
  z-index: 1000;
  opacity: 1;
  animation-delay: 0s;
  bottom: 0;
}
section .wave.wave2 {
  animation: wave-animate2 15s linear infinite;
  z-index: 999;
  opacity: 0.5;
  animation-delay: -3s;
  bottom: 20px;
}
section .wave.wave3 {
  animation: wave-animate1 30s linear infinite;
  z-index: 998;
  opacity: 0.2;
  animation-delay: -2s;
  bottom: 25px;
}
section .wave.wave4 {
  animation: wave-animate2 5s linear infinite;
  z-index: 997;
  opacity: 0.7;
  animation-delay: -5s;
  bottom: 30px;
}
</style>
