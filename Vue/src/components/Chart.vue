<script setup lang="ts">
import type { IStroke } from '@/interfaces/IStroke';
import type { IStrokeDetailed } from '@/interfaces/IStrokeDetailed';
import { onMounted, reactive, ref, toRefs, watch } from 'vue';

const calculateInterest = (max: number, current: number) => {
  return ((current * 100) / max) / 100;
};

function divideNumber(num: number, arr: [number, number, number, number]) {
  let number = num;

  const firstPart = Math.min(number, arr[0]);
  number -= firstPart;

  const secondPart = Math.min(number, arr[1]);
  number -= secondPart;

  const thirdPart = Math.min(number, arr[2]);
  number -= thirdPart;

  const fourthPart = number;

  return [calculateInterest(arr[0], firstPart),
  calculateInterest(arr[1], secondPart),
  calculateInterest(arr[2], thirdPart),
  calculateInterest(arr[3], fourthPart)];
}

function animate(args: {
  items: Array<{
    from: number,
    to: number,
    id: number
  }>;
  speed: number,
}) {
  let startTime: number;
  const {
    speed, items
  } = args;

  const step = (time: number) => {
    if (!startTime) {
      startTime = time;
    }
    let requireAnimationFrame = false;
    const result: IStroke[] = props.data.map((e) => ({ ...e }));
    for (const { id, from, to } of items) {

      const elapsed = time - startTime;
      const progress = Math.min(elapsed / speed, 1);
      const value = from + (to - from) * progress;
      if (progress < 1) {
        requireAnimationFrame = true;
      }
      const item = result.find((e) => e.id === id);
      if (item) {
        item.progress = value
      }
    }
    strokes.splice(0)
    strokes.push(...updateStrokes(result));

    if (requireAnimationFrame) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

const updateStrokes = (inputData: Array<IStroke>): IStrokeDetailed[] => {
  return inputData.map((item, i) => {
    const newR = r + (i * gapWithStrokeWidth);
    const secondDash = (newR) * circleCoef;

    const circleCenterBefore = localCircleCenterX - 0.2;
    const circleCenterAfter = localCircleCenterY + 0.1;

    const centerLineY = localCircleCenterY - r - i * gapWithStrokeWidth;
    const bottomLineX = localCircleCenterX + r + i * gapWithStrokeWidth;
    const topLineY1 = localCircleCenterY - rLastItem - charStrokeWidth;
    const strokeDasharray = `${(secondDash / 2) * 1.5},${secondDash}`;
    const bottomLineY1 = localCircleCenterY - r + charStrokeWidth;

    const topLineSize = topLineY1;
    const bottomLineSize = circleCenterAfter - (localCircleCenterY - r + charStrokeWidth);
    const circleSize = (2 * Math.PI * r) * (3 / 4);
    const centerLineSize = 100 - circleCenterBefore;
    const totalSize = topLineSize + bottomLineSize + circleSize + centerLineSize;

    const parts = divideNumber(item.progress, [
      calculateInterest(totalSize, topLineSize) * 100,
      calculateInterest(totalSize, bottomLineSize) * 100,
      calculateInterest(totalSize, circleSize) * 100,
      calculateInterest(totalSize, centerLineSize) * 100,
    ]);

    const fillCenterLineY = circleCenterBefore + ((circleCenterAfter) * parts[3]);
    const fillBottomLineX = bottomLineY1 + ((circleCenterAfter - bottomLineY1) * parts[1]);
    const fillTopLineY1 = topLineY1 * parts[0];

    const fillStrokeDasharray = `${(secondDash / 2) * (1.5 * parts[2])},${secondDash}`;

    return {
      newR,
      secondDash,
      centerLineY,
      bottomLineX,
      topLineY1,
      strokeDasharray,
      bottomLineY1,
      fillCenterLineY,
      fillBottomLineX,
      fillTopLineY1,
      fillStrokeDasharray,
      circleCenterBefore,
      circleCenterAfter,
      ...item,
    };
  });
}

const props = defineProps({
  data: {
    type: Array<IStroke>,
    required: true,
  },
  gap: {
    type: Number,
    default: 0.5,
    required: false
  },
  strokeWidth: {
    type: Number,
    required: false
  }, radius: {
    type: Number,
    required: false
  }, circleCenterX: {
    type: Number,
    required: false
  },
  circleCenterY: {
    type: Number,
    required: false
  },
});

const startValues: Record<number, {
  strokeWidth: number,
  r: number,
}> = {
  1: {
    strokeWidth: 4,
    r: 20,
  },
  2: {
    strokeWidth: 4,
    r: 20,
  },
  3: {
    strokeWidth: 4,
    r: 20,
  },
  4: {
    strokeWidth: 4,
    r: 20,
  },
  5: {
    strokeWidth: 4,
    r: 19,
  },
  6: {
    strokeWidth: 3,
    r: 19,
  },
  7: {
    strokeWidth: 3,
    r: 17,
  },
  8: {
    strokeWidth: 2.5,
    r: 17,
  },
  9: {
    strokeWidth: 2,
    r: 17,
  },
  10: {
    strokeWidth: 2,
    r: 16,
  },
};

const chartRef = ref();
const chartSize = ref(0);
const { strokes } = reactive<{
  strokes: IStrokeDetailed[]
}>({
  strokes: []
});

const localCircleCenterX = props.circleCenterX || 40;
const localCircleCenterY = props.circleCenterY || 60;
const charStrokeWidth = props.strokeWidth || startValues[props.data.length].strokeWidth;
const gapWithStrokeWidth = charStrokeWidth + props.gap;
const r = props.radius || startValues[props.data.length].r;
const circleCoef = 2 * Math.PI;
const rLastItem = r + ((props.data.length - 1) * gapWithStrokeWidth);

const processValues = props.data.reduce((acc, val) => {
  acc[val.id] = val.progress;
  return acc;
}, <Record<number, number>>{});

onMounted(() => {
  if (chartRef.value) {
    const sizeValue = Math.min(chartRef.value.clientWidth, chartRef.value.clientHeight);
    chartSize.value = sizeValue / 500;
  }
});

watch(() => props.data, (newVal: IStroke[]) => {
  animate({
    items: newVal
      .filter(e => processValues[e.id] !== e.progress)
      .map(e => ({ from: processValues[e.id], to: e.progress, id: e.id })),
    speed: 500
  });
}, { deep: true });

strokes.push(...updateStrokes(props.data));
</script>

<template>
  <div class="chart-wrapper">
    <svg ref="chartRef" class="chart" viewBox="0 0 100 100">
      <template v-for="stroke in strokes">
        <line :x1="stroke.bottomLineX" :x2="stroke.bottomLineX" :y1="stroke.topLineY1" y2="0"
          :stroke-width="charStrokeWidth" stroke="#cccccc" />
        <line :x1="stroke.bottomLineX" :x2="stroke.bottomLineX" :y1="stroke.circleCenterAfter"
          :y2="localCircleCenterY - r + charStrokeWidth" :stroke-width="charStrokeWidth" stroke="#cccccc" />
        <circle :r="stroke.newR" :cx="localCircleCenterX" :cy="localCircleCenterY" class="pie"
          :stroke-width="charStrokeWidth" stroke="#cccccc" :stroke-dasharray="stroke.strokeDasharray" fill="none" />
        <line :x1="stroke.circleCenterBefore" x2="100" :y1="stroke.centerLineY" :y2="stroke.centerLineY"
          :stroke-width="charStrokeWidth" stroke="#cccccc" />
        <line :x1="stroke.bottomLineX" :x2="stroke.bottomLineX" :y1="stroke.fillTopLineY1" y2="0"
          :stroke-width="charStrokeWidth" :stroke="stroke.color" />
        <line :x1="stroke.bottomLineX" :x2="stroke.bottomLineX" :y2="stroke.fillBottomLineX"
          :y1="localCircleCenterY - r + charStrokeWidth" :stroke-width="charStrokeWidth" :stroke="stroke.color" />
        <circle :r="stroke.newR" :cx="localCircleCenterX" :cy="localCircleCenterY" class="pie"
          :stroke-width="charStrokeWidth" :stroke="stroke.color" :stroke-dasharray="stroke.fillStrokeDasharray"
          fill="none" />
        <line :x1="stroke.circleCenterBefore" :x2="stroke.fillCenterLineY" :y1="stroke.centerLineY"
          :y2="stroke.centerLineY" :stroke-width="charStrokeWidth" :stroke="stroke.color" />
      </template>
    </svg>
    {{ props.circleCenterX }}
    <div class="chart-info" :style="{
      top: localCircleCenterY + '%',
      left: localCircleCenterX + '%',
      transform: `translate(-50%, -50%) scale(${1 * chartSize})`,
    }">
      <span class="main-text">
        9999
      </span>
      <span class="second-text">
        kgCO2e
      </span>
    </div>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 500px;
  height: 500px;
  position: relative;

  .chart {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
  }

  .main-text {
    font-size: 32px;
  }

  .second-text {
    font-size: 16px;
    color: #b3b3b3;
  }

  .chart-info {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
}
</style>
