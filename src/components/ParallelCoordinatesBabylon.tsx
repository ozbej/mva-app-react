import React, { useRef, useEffect } from 'react';
import { Engine, Scene, Vector3, MeshBuilder, UniversalCamera } from '@babylonjs/core';
import { MultiLine, AdvancedDynamicTexture } from '@babylonjs/gui';

const ParallelCoordinatesBabylon = (props: any) => {
  const ref: any = useRef(null);

  function createLine(dataItem: number[]) {
    let line: MultiLine = new MultiLine();
    line.color = "white";
    line.lineWidth = 1;
    for (let i = 0; i < dataItem.length; i++) {
      line.add({x: i*100, y: dataItem[i]});
    }
    return line;
  }

  useEffect(() => {
    const engine = new Engine(ref.current, true);
    const scene = new Scene(engine);

    const camera = new UniversalCamera("camera1", new Vector3(0, 5, -10), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(ref.current, true);
   
    //Create a 2D plane
    var plane = MeshBuilder.CreatePlane("plane", {width: 1000, height: 300}, scene);
    plane.position.z = 0.1;
    plane.isPickable = false;

    let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    props.data.forEach((dataItem: number[], i: number) => {
      let line: MultiLine = createLine(dataItem);
      advancedTexture.addControl(line);
    });

    // Render the scene
    engine.runRenderLoop(() => {
        scene.render();
    });

    return function cleanup() {
      scene.dispose();
      engine.dispose();
    }
  }, [props.data]);

  return <>
    <h2>Babylon:</h2>
    <canvas
      ref={ref}
      width={1000}
      height={300} />
    </>
};

export default ParallelCoordinatesBabylon;