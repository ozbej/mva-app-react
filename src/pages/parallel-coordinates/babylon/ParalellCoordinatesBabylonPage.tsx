import React from 'react';
import ParallelCoordinatesBabylon from '../../../components/parallel-coordinates/babylon/ParallelCoordinatesBabylon';

function ParallelCoordinatesBabylonPage(props: any) {
  return (
    <>
      <ParallelCoordinatesBabylon data={props.data} />
    </>
  );
}

export default ParallelCoordinatesBabylonPage;