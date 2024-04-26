import React, { useMemo } from 'react';
import { Chart } from '~/components/Chart/Chart';
import { IStroke } from '~/interfaces/IStroke';

const HomePage = () => {
  const strokes: IStroke[] = useMemo(() => {
    return [
      {
        id: 1,
        color: '#5CA82E',
        progress: 100,

      },
      {
        id: 2,
        color: '#ED7C13',
        progress: 66,

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
  }, [ ]);
  return (
    <div>

      <Chart data={ strokes } />

    </div>
  );
};

export default HomePage;
