import React, { useEffect, useState } from 'react';
import Dexie from 'dexie';
import FileUploader from '../../components/file-uploader/FileUploader';
import DatasetUploader from '../../components/dataset-uploader/DatasetUploader';
import TableView from '../../components/table-view/TableView';
import "./Home.css"

type homeProps = {
  onDataChange: any;
}

function Home(props: homeProps) {
 const [header, setHeader] = useState([]) as any[];
 const [rows, setRows] = useState([]) as any[];

 // Random data info
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
      db.table('headerRow').toArray().then(data => {
        headersTemp = data;
        setHeader(headersTemp);

        // Filter non-number columns
        let headerRowFiltered: any[] = [];
        headersTemp.forEach((item: any, i: number) => {
          if (item.type === "number") headerRowFiltered.push(item);
        })
        let dataFiltered: any[] = [];
        let currRow: number[] = [];
        rowsTemp.forEach((row: any, i: number) => {
          currRow = [];
          row.forEach((value: any, j: number) => {
            if (headersTemp[j].type === "number") currRow.push(Number(value));
          })
          dataFiltered.push(currRow);
        });

        props.onDataChange({data: dataFiltered, headerRow: headerRowFiltered});
      });
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
    db.table('rows').bulkAdd(rows);

    setHeader(headerRow);
    const rowsTemp: any[][] = rows.map(obj => Object.values(obj));
    setRows(rowsTemp)

    // Filter non-number columns
    let headerRowFiltered: any[] = [];
    headerRow.forEach((item: any, i: number) => {
      if (item.type === "number") headerRowFiltered.push(item);
    })
    let dataFiltered: any[] = [];
    let currRow: number[] = [];
    rowsTemp.forEach((row: any, i: number) => {
      currRow = [];
      row.forEach((value: any, j: number) => {
        if (headerRow[j].type === "number") currRow.push(Number(value));
      })
      dataFiltered.push(currRow);
    });

    props.onDataChange({data: dataFiltered, headerRow: headerRowFiltered});
  });
 }

 const importRandomData = async (e: any) => {
  e.preventDefault();

  let rows: any[] = [];
  for (let i: number = 0; i < randomData.rows; i++)
    rows.push(Array.from({length: randomData.dimensions}, () => Math.floor(Math.random() * 100)));

  let headerRow: any[] = [];
  for (let i: number = 0; i < randomData.dimensions; i++)
  headerRow.push({title: `Dim-${i+1}`, type: "number"});

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
    db.table('rows').bulkAdd(rows);

    setHeader(headerRow);
    const rowsTemp: any[][] = rows.map(obj => Object.values(obj));
    setRows(rowsTemp)

    props.onDataChange({data: rowsTemp, headerRow: headerRow});
  });
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
    </div>
  );
}

export default Home;
