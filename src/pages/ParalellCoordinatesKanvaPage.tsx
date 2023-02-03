import React from 'react';
import ParallelCoordinatesKanva from '../components/ParallelCoordinatesKanva';

function ParallelCoordinatesPage(props: any) {
    return (
      <ParallelCoordinatesKanva data={props.data} />
    );
}

export default ParallelCoordinatesPage;