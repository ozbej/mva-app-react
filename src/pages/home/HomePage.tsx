import React from 'react';
import Home from '../../components/home/Home';

type homePageProps = {
    updateRandomData: any;
}

function HomePage(props: homePageProps) {
    function updateRandomData(arr: any) {
        props.updateRandomData(arr);
    }

    return (
        <Home updateRandomData={updateRandomData} />
    );
}

export default HomePage;