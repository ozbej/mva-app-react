import React from 'react';
import ParallelCoordinatesCanvas2d from '../components/ParallelCoordinatesCanvas2d';

function ParallelCoordinatesPage(props: any) {
    return (
      <ParallelCoordinatesCanvas2d data={props.data} />
    );
}

export default ParallelCoordinatesPage;