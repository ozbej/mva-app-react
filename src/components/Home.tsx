import React, { useEffect, useState } from 'react';
import Dexie from 'dexie';

import ParallelCoordinatesKanva from './ParallelCoordinatesKanva';
import ParallelCoordinatesCanvas2d from './ParallelCoordinatesCanvas2d';
import FileUploader from './FileUploader';
import TableView from './TableView';

let randomData: any[] = [];

for (let i: number = 0; i < 1000; i++) {
  randomData.push(Array.from({length: 10}, () => Math.floor(Math.random() * 200)));
}

function Home() {
  const [header, setHeader] = useState([]) as any[];
  const [rows, setRows] = useState([]) as any[];

  let db: Dexie = new Dexie("dataset");

  useEffect(() => {
    Dexie.exists("dataset")
    .then((exists: boolean) => {
      if (!exists) {
        console.log("DB initialized");
        db.version(1).stores({
          rows: "++id",
          headerRow: "++id, title"
        });
      }
    })
    .then(() => db.open())
    .then((data: any) => {
      console.log("DB opened");
      db.table('rows').toArray().then(data => setRows(data));
      db.table('headerRow').toArray().then(data => setHeader(data));
    })
    .catch(err => console.log(err.message));
  }, [])

  const datasetUploaded = async (headerRow: any[], rows: any[]) => {
    // Close previous db and delete it
    await db.close();
    await db.delete();

    // Set indexing of db to all columns
    let indexString: string = "++id";
    for (let header of headerRow) {
        indexString += `, ${header.title}`;
    }

    
    db.version(1).stores({
      rows: indexString,
      headerRow: "++id, title"
    });

    console.log(indexString);

    db.open().then(data => console.log("DB re-opened"));
    
    // Insert headerRow and rows to db
    db.table('headerRow').bulkAdd(headerRow);
    db.table('rows').bulkAdd(rows);

    // Set headeRow and rows
    db.table('headerRow').toArray().then(data => {
      setHeader(data)
    });
    db.table('rows').toArray().then(data => {
      setRows(data)
    });
  }

  return (
    <div className="App">
      <h1>MVA App</h1>
      <FileUploader setHeader={setHeader} setRows={setRows} datasetUploaded={datasetUploaded} />
      <TableView header={header} rows={rows}/>
    </div>
  );
}

export default Home;
