import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { IStroke } from '~/interfaces/IStroke';
import style from './Chart.module.scss';

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

  return [ calculateInterest(arr[0], firstPart),
    calculateInterest(arr[1], secondPart),
    calculateInterest(arr[2], thirdPart),
    calculateInterest(arr[3], fourthPart) ];
}
const actualKeys: Record<string, number> = {};
function animate(arg: {
  from: number, to: number,
  speed: number,
  setter: React.Dispatch<React.SetStateAction<IStroke[]>>,
  key: string
  id: number
  data: IStroke[],
}) {
  let startTime: number;
  const {
    speed, to, from, setter, key, id, data,
  } = arg;

  const currentKey = Math.random();

  actualKeys[key] = currentKey;

  const step = (time: number) => {
    if (actualKeys[key] !== currentKey) {
      return;
    }
    if (!startTime) {
      startTime = time;
    }

    const elapsed = time - startTime;
    const progress = Math.min(elapsed / speed, 1);
    const value = from + (to - from) * progress;

    setter((prev) => data.map((item, i) => {
      if (item.id !== id) {
        return {
          ...item,
          progress: Math.max(prev[i]?.progress || data[i]?.progress || 0.01, 0.01),
        };
      }

      return {
        ...item,
        progress: value,

      };
    }));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}
type Props = {
  data: IStroke[]
  gap?: number
  strokeWidth?: number
  radius?: number
  circleCenterX?: number
  circleCenterY?: number
};

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

export const Chart: React.FC<Props> = ({
  data, gap = 0.5, strokeWidth, radius, circleCenterX, circleCenterY,
}) => {
  const [ localData, setLocalData ] = useState<IStroke[]>(data);
  const dataLength = useMemo(() => data.length, [ data.length ]);
  const charStrokeWidth = useMemo(() => strokeWidth
  || startValues[dataLength].strokeWidth, [ dataLength, strokeWidth ]);
  const gapWithStrokeWidth = useMemo(() => charStrokeWidth + gap, [ gap, charStrokeWidth ]);
  const r = useMemo(() => radius || startValues[dataLength].r, [ dataLength, radius ]);
  const circleCoef = useMemo(() => 2 * Math.PI, []);

  useEffect(() => {
    localData.forEach((dataItem, i) => {
      if (data[i]) {
        animate({
          setter: setLocalData,
          speed: 500,
          from: dataItem.progress || data[i].progress,
          to: Math.min(data[i].progress, 100),
          key: `strokeWidth ${ dataItem.id }`,
          id: dataItem.id,
          data,
        });
      }
    });
  }, [ data ]);

  const rLastItem = useMemo(
    () => r + ((localData.length - 1) * gapWithStrokeWidth),
    [ gapWithStrokeWidth, localData.length, r ],
  );

  const localCircleCenterX = useMemo(() => circleCenterX || 40, [ circleCenterX ]);
  const localCircleCenterY = useMemo(() => circleCenterY || 60, [ circleCenterY ]);

  const renderStrokes = useMemo(() => {
    return localData.map((item, i) => {
      const newR = r + (i * gapWithStrokeWidth);
      const secondDash = (newR) * circleCoef;

      const circleCenterBefore = localCircleCenterX - 0.2;
      const circleCenterAfter = localCircleCenterY + 0.1;

      const centerLineY = localCircleCenterY - r - i * gapWithStrokeWidth;
      const bottomLineX = localCircleCenterX + r + i * gapWithStrokeWidth;
      const topLineY1 = localCircleCenterY - rLastItem - charStrokeWidth;
      const strokeDasharray = `${ (secondDash / 2) * 1.5 },${ secondDash }`;
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

      const fillStrokeDasharray = `${ (secondDash / 2) * (1.5 * parts[2]) },${ secondDash }`;

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
  }, [ localCircleCenterX,
    localCircleCenterY, circleCoef,
    gapWithStrokeWidth, localData, r, rLastItem,
    charStrokeWidth ]);

  const chartRef = useRef<SVGSVGElement | null>(null);
  const chartSize = useMemo(() => {
    if (chartRef.current) {
      const sizeValue = Math.min(chartRef.current?.clientWidth, chartRef.current?.clientHeight);
      return sizeValue / 500;
    }

    return 0;
  }, [ chartRef.current?.clientWidth, chartRef.current?.clientHeight ]);

  return (
    <div className={ style['chart-wrapper'] }>
      <svg
        ref={ chartRef }
        className={ style.chart }
        viewBox="0 0 100 100"
      >
        {renderStrokes.map(({
          newR,
          centerLineY,
          bottomLineX,
          topLineY1,
          strokeDasharray,
          fillCenterLineY,
          fillBottomLineX,
          fillTopLineY1,
          fillStrokeDasharray,
          progress, color,
          id,
          circleCenterBefore,
          circleCenterAfter,
        }) => {
          return (
            <>
              <line
                x1={ bottomLineX }
                x2={ bottomLineX }
                y1={ topLineY1 }
                y2={ 0 }
                strokeWidth={ charStrokeWidth }
                stroke="#cccccc"
                key={ `${ id + progress }top` }
              />
              <line
                x1={ bottomLineX }
                x2={ bottomLineX }
                y1={ circleCenterAfter }
                y2={ localCircleCenterY - r + charStrokeWidth }
                strokeWidth={ charStrokeWidth }
                stroke="#cccccc"
                key={ `${ id + progress }bottom` }
              />
              <circle
                key={ `${ id + progress }circle` }
                r={ newR }
                cx={ localCircleCenterX }
                cy={ localCircleCenterY }
                className="pie"
                strokeWidth={ charStrokeWidth }
                stroke="#cccccc"
                strokeDasharray={ strokeDasharray }
                fill="none"
              />
              <line
                x1={ circleCenterBefore }
                x2="100"
                y1={ centerLineY }
                y2={ centerLineY }
                strokeWidth={ charStrokeWidth }
                stroke="#cccccc"
                key={ `${ id + progress }center` }
              />

              <line
                x1={ bottomLineX }
                x2={ bottomLineX }
                y1={ fillTopLineY1 }
                y2={ 0 }
                strokeWidth={ charStrokeWidth }
                key={ `${ id }top` }
                stroke={ color }
              />
              <line
                x1={ bottomLineX }
                x2={ bottomLineX }
                y2={ fillBottomLineX }
                y1={ localCircleCenterY - r + charStrokeWidth }
                strokeWidth={ charStrokeWidth }
                key={ `${ id }bottom` }
                stroke={ color }
              />
              <circle
                key={ `${ id }circle` }
                r={ newR }
                cx={ localCircleCenterX }
                cy={ localCircleCenterY }
                className="pie"
                strokeWidth={ charStrokeWidth }
                stroke={ color }
                strokeDasharray={ fillStrokeDasharray }
                fill="none"
              />
              <line
                x1={ circleCenterBefore }
                x2={ fillCenterLineY }
                y1={ centerLineY }
                y2={ centerLineY }
                strokeWidth={ charStrokeWidth }
                stroke={ color }
                key={ `${ id }center` }
              />
            </>
          );
        })}
      </svg>
      <div
        className={ style['chart-info'] }
        style={ {
          top: `${ localCircleCenterY }%`,
          left: `${ localCircleCenterX }%`,
          transform: `translate(-50%, -50%) scale(${ 1 * chartSize })`,
        } }
      >
        <span
          className={ style['main-text'] }
        >
          9999
        </span>
        <span
          className={ style['second-text'] }
        >
          kgCO2e
        </span>
      </div>

    </div>
  );
};
