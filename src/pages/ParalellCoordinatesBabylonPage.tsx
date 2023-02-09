import React from 'react';
import ParallelCoordinatesBabylon from '../components/ParallelCoordinatesBabylon';

function ParallelCoordinatesBabylonPage(props: any) {
  return (
    <>
      <ParallelCoordinatesBabylon data={props.data} />
    </>
  );
}

export default ParallelCoordinatesBabylonPage;