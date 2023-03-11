import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Line, OrthographicCamera } from '@react-three/drei'

let arr: any[] = [];
for (let i = 0; i < 1000; i++)
  arr.push(i);

function ParallelCoordinatesThree(props: any) {
  const width = window.innerWidth;
  const height = 600;

  return (
    <Canvas style={{ width: '100%', height: `${height}px` }}>
      {/* {arr.map(i => <Line points={[[0,0,0], [20,i*0.5,0]]} color="red" lineWidth={1} key={`line-${i}`} />)} */}
      <group>
      <mesh>
        <planeBufferGeometry args={[10, 0, 10]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <Line points={[
    [0, 0], [20, 50]
  ]} color="#FF0000" />
    </group>
    </Canvas>
  );
}

export default ParallelCoordinatesThree;