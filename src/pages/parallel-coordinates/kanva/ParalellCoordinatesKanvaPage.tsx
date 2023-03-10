import React from 'react';
import ParallelCoordinatesKanva from '../../../components/parallel-coordinates/kanva/ParallelCoordinatesKanva';

function ParallelCoordinatesKanvaPage(props: any) {
    return (
      <ParallelCoordinatesKanva data={props.data} />
    );
}

export default ParallelCoordinatesKanvaPage;