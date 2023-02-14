import React, { useEffect, useState } from 'react';
import Dexie from 'dexie';

import FileUploader from './FileUploader';
import TableView from './TableView';
import ParallelCoordinatesKanva from './ParallelCoordinatesKanva';

let randomData: any[] = [];

for (let i: number = 0; i < 100; i++) {
  randomData.push(Array.from({length: 10}, () => Math.floor(Math.random() * 200)));
}

function Home() {
 const [header, setHeader] = useState([]) as any[];
 const [rows, setRows] = useState([]) as any[];
 const [data, setData] = useState([]) as any[];
 const [dataHeaders, setDataHeaders] = useState([]) as any[];

 let db: Dexie = new Dexie("dataset");

 useEffect(() => {
  let rowsTemp: any[] = [];
  let headersTemp: any[] = [];

  Dexie.exists("dataset")
  .then((exists: boolean) => {
    if (!exists) {
      console.log("DB initialized");
      db.version(1).stores({
        rows: "++id",
        headerRow: "++id, title, type"
      });
    }
  })
  .then(() => db.open())
  .then((data: any) => {
    console.log("DB opened");
    db.table('rows').toArray().then(data => {
      rowsTemp = data.map(obj => {
        delete obj.id;
        return Object.values(obj)
      });
      setRows(rowsTemp);
    });
    db.table('headerRow').toArray().then(data => {
      headersTemp = data;
      setHeader(headersTemp);
      filterData(headersTemp, rowsTemp);
    });
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
    headerRow: "++id, title, type"
  });

  db.open()
  .then(() => {
    console.log("DB re-opened")

    // Insert headerRow and rows to db
    db.table('headerRow').bulkAdd(headerRow);
    db.table('rows').bulkAdd(rows)

    setHeader(headerRow);
    const rowsTemp: any[] = rows.map(obj => Object.values(obj));
    setRows(rowsTemp)
    filterData(headerRow, rowsTemp);
  });
 }

 // Function that filters data
 function filterData(header: any[], rows: any[]) {
  let dataTemp: any[] = [];
  let currRow: number[] = [];
  let dataHeadersTemp: string[] = [];

  header.forEach((item: any, i: number) => {
    if (item.type === "number") dataHeadersTemp.push(item.title);
  })
  setDataHeaders(dataHeadersTemp);

  rows.forEach((row: any, i: number) => {
    currRow = [];
    row.forEach((value: any, j: number) => {
      if (header[j].type === "number") currRow.push(Number(value));
    })
    dataTemp.push(currRow);
  });

  setData(dataTemp);
 }

  return (
    <div className="App">
      <h1>MVA App</h1>
      <FileUploader datasetUploaded={datasetUploaded} />
      <TableView header={header} rows={rows}/>
      {data && data.length !== 0 ? <ParallelCoordinatesKanva data={data} dataHeaders={dataHeaders} /> : <></>}
    </div>
  );
}

export default Home;
