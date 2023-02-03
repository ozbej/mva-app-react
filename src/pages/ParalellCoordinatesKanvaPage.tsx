import React from 'react';
import ParallelCoordinatesKanva from '../components/ParallelCoordinatesKanva';

function ParallelCoordinatesKanvaPage(props: any) {
    return (
      <ParallelCoordinatesKanva data={props.data} />
    );
}

export default ParallelCoordinatesKanvaPage;