import React, { useRef, useEffect } from 'react';

const ParallelCoordinatesCanvas2d = (props: any) => {
  const ref: any = useRef(null);

  useEffect(() => {
    const canvas: any = ref.current;
    const context: any = canvas.getContext("2d");

    props.data.forEach((dataItem: number[], i: number) => {
      context.lineWidth = 1;
      context.beginPath();
      for (let i = 0; i < dataItem.length; i++) {
        context.lineTo(i*100, dataItem[i]);
        context.moveTo(i*100, dataItem[i]);
        context.stroke();
        context.closePath();
      }
    });
  })

  return <>
    <h2>Canvas2d:</h2>
    <canvas
    ref={ref}
    width={1000}
    height={300} />
  </>
};

export default ParallelCoordinatesCanvas2d;