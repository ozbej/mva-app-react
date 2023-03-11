import React, { useEffect, useState } from 'react';
import Dexie from 'dexie';
import FileUploader from '../file-uploader/FileUploader';
import DatasetUploader from '../dataset-uploader/DatasetUploader';
import TableView from '../table-view/TableView';
import ParallelCoordinatesPixi from '../parallel-coordinates/pixijs/ParallelCoordinatesPixi';
import "./Home.css"

function Home() {
 const [header, setHeader] = useState([]) as any[];
 const [rows, setRows] = useState([]) as any[];
 const [data, setData] = useState([]) as any[];
 const [dataHeaders, setDataHeaders] = useState([]) as any[];
 const [randomData, setRandomData] = useState({rows: 100, dimensions: 20}) as any;

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
  for (let i: number = 0; i < headerRow.length; i++)
      indexString += `, $${i}`; // Add $ since IndexedDB columns can not start with a number

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

 const importRandomData = (e: any): void => {
  e.preventDefault();

  let random: any[] = [];
  for (let i: number = 0; i < randomData.rows; i++)
    random.push(Array.from({length: randomData.dimensions}, () => Math.floor(Math.random() * 100)));

  let randomHeaders: string[] = [];
  for (let i: number = 0; i < randomData.dimensions; i++)
    randomHeaders.push(`Dim-${i+1}`);

  setData(random);
  setDataHeaders(randomHeaders);
 };

  return (
    <div className="App">
      <h1>MVA App</h1>
      <div className="importContainer">
        <div className="randomImport">
          <b>Import random data:</b>
          <form className="formContainer">
            <div className="inputContainer">
              <label htmlFor="randomRows">No. of rows</label>
              <input
              type="number"
              value={randomData.rows}
              onChange={(e) => setRandomData({rows: e.target.value, dimensions: randomData.dimensions})}
              id="randomRows" />
            </div>
            <div className="inputContainer">
              <label htmlFor="randomDimensions">No. of dimensions</label>
              <input
              type="number"
              value={randomData.dimensions} 
              onChange={(e) => setRandomData({rows: randomData.rows, dimensions: e.target.value})}
              id="randomDimensions" />
            </div>
            <button style={{height: "50%"}} onClick={(e) => {importRandomData(e);}}>
              IMPORT RANDOM
            </button>
          </form>
        </div>
        <div className="fileImport">
          <b>Import custom data:</b>
          <FileUploader datasetUploaded={datasetUploaded} />
        </div>
        <div className="predefinedImport">
          <b>Import pre-defined data:</b>
          <DatasetUploader datasetUploaded={datasetUploaded} />
        </div>
      </div>
      <TableView header={header} rows={rows}/>
      {/* {data && data.length !== 0 ? <ParallelCoordinatesKanva data={data} dataHeaders={dataHeaders} /> : <></>} */}
      {data && data.length !== 0 ? <ParallelCoordinatesPixi data={data} dataHeaders={dataHeaders} /> : <></>}
    </div>
  );
}

export default Home;
