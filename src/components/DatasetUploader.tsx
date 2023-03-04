import React, { useState } from "react";

interface DatasetUploaderProps {
  datasetUploaded: (headerRow: any[], rows: any[]) => void;
}
 
function DatasetUploader({ datasetUploaded }: DatasetUploaderProps) {
  const [file, setFile] = useState();
  const fileReader = new FileReader();

  const handleOnChange = (e: any): void => {
    setFile(e.target.value);
  };

  const csvFileToArray = (string: string): void => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const array: any[] = csvRows.map(i => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object: any, header: any, index: number) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    let headerRow: any[] = parseHeaderRow(csvHeader, array[0]);

    datasetUploaded(headerRow, array);
  };

  const parseHeaderRow = (headerRow: any[], firstRow: any): any[] => {
    let headerRowNew: any[] = [];
    let currType: string = "";
    let firstRowValue: string = "";
    headerRow.forEach((item: string) => {
      // Add $ if column starts with number (indexedDB convention)
      if (parseInt(item.charAt(0))) item = "$" + item;

      // Determine row type (string or number)
      firstRowValue = firstRow[item];
      currType = "string";
      if (!isNaN(Number(firstRowValue))) currType = "number";

      headerRowNew.push({title: item, type: currType});
    });

    return headerRowNew;
  };
 
  const handleOnSubmit = (e: any): void => {
    e.preventDefault();
    console.log("Pre-defined dataset imported!");
  };
    
  return (
    <div style={{ textAlign: "center" }}>
      <form>
        <select value={file} onChange={(e) => handleOnChange(e)}>
          <option value="empty">---</option>
          <option value="football1">Football 1</option>
          <option value="football2">Football 2</option>
        </select>
        <button onClick={(e) => handleOnSubmit(e)}>
          IMPORT PRE-DEFINED
        </button>
      </form>
    </div>
  );
}

export default DatasetUploader;