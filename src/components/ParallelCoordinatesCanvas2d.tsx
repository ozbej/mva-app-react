import React, { useRef, useEffect } from 'react';

let data: any[] = [];

for (let i: number = 0; i < 1000; i++) {
  data.push(Array.from({length: 10}, () => Math.floor(Math.random() * 500)));
}

const ParallelCoordinatesCanvas2d = () => {
  let ref: any = useRef(null);

  useEffect(() => {
    let canvas: any = ref.current;
    let context: any = canvas.getContext("2d");

    data.forEach((dataItem: number[], i: number) => {
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

  return <div style={{width: '1000px', height: '500px'}}>
    <div>Canvas2d:</div>
    <canvas
    ref={ref}
    width={1000}
    height={500} />
  </div>
}

export default ParallelCoordinatesCanvas2d;