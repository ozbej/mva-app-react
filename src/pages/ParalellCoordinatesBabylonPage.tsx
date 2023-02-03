import React from 'react';
import ParallelCoordinatesBabylon from '../components/ParallelCoordinatesBabylon';

function ParallelCoordinatesPage(props: any) {
    return (
      <ParallelCoordinatesBabylon data={props.data} />
    );
}

export default ParallelCoordinatesPage;