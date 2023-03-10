import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line, OrthographicCamera } from '@react-three/drei'
 
function ParallelCoordinatesThree(props: any) {

  return (
    <Canvas style={{ width: '100%', height: '600px' }}>
      <Line points={[[0,0,0], [20,20,0]]} color="red" lineWidth={1} key="line-1" />
      <Line points={[[0,0,0], [10,50,0]]} color="black" lineWidth={1} key="line-2" />
    </Canvas>
  );
}

export default ParallelCoordinatesThree;