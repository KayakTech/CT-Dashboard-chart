<script setup lang="ts">
import { ref } from 'vue';
import Chart from './components/Chart.vue'

const strokes = [{
  id: 1,
  color: '#5CA82E',
  progress: 1
  ,
},
{
  id: 2,
  color: '#ED7C13',
  progress: 10,
},
{
  id: 3,
  color: '#2566C7',
  progress: 66,

},
{
  id: 4,
  color: '#7A63B0',
  progress: 66,
},
{
  id: 5,
  color: '#17BEBB',
  progress: 88,
},
{
  id: 6,
  color: '#ffff00',
  progress: 10,
},
{
  id: 7,
  color: '#ffff00',
  progress: 38,
},
{
  id: 8,
  color: '#ffff00',
  progress: 71,
},
{
  id: 9,
  color: '#ffff00',
  progress: 32,
},
{
  id: 10,
  color: '#ffff00',
  progress: 30,
},
].filter((__, i) => i < 4);

const strokesRef = ref(strokes);

setTimeout(() => {
  strokesRef.value[0].progress = 100
  strokesRef.value[1].progress = 100
  strokesRef.value[2].progress = 100
  strokesRef.value[3].progress = 100
  // strokesRef.value[4].progress = 100
  // strokesRef.value[5].progress = 100
  // strokesRef.value[6].progress = 100
}, 5000);
</script>

<template>
  <div>
    <Chart :data="strokesRef" />
  </div>
</template>

<style scoped></style>
