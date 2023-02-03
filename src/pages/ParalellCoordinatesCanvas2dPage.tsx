import React from 'react';
import ParallelCoordinatesCanvas2d from '../components/ParallelCoordinatesCanvas2d';

function ParalellCoordinatesCanvas2dPage(props: any) {
    return (
      <ParallelCoordinatesCanvas2d data={props.data} />
    );
}

export default ParalellCoordinatesCanvas2dPage;