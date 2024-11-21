<script setup lang="ts">
import Main from './components/Main.vue';
</script>

<template>
  <div class="background-container">
    <div class="overlay"></div>
    <div id="app">
      <Main />
    </div>
  </div>
</template>

<style scoped>
.background-container {
  position: relative;
  background-image: url('./assets/marvelHeroes.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1;
}

#app {
  position: relative;
  z-index: 2;
}
</style>
