import React, { useState } from "react";

interface FileUploaderProps {
  setHeader: (data: any[]) => void;
  setRows: (data: any[]) => void;
}
 
function FileUploader({setHeader, setRows}: FileUploaderProps) {
  const [file, setFile] = useState();

  const fileReader = new FileReader();

  const handleOnChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const csvFileToArray = (string: string) => {
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

    setHeader(csvHeader);
    setRows(array);
  };
 
   const handleOnSubmit = (e: any) => {
     e.preventDefault();
 
     if (file) {
       fileReader.onload = function (event: any) {
         const text = event.target.result;
         csvFileToArray(text);
       };
 
       fileReader.readAsText(file);
     }
   };
    
  return (
    <div style={{ textAlign: "center" }}>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />

        <button
          onClick={(e) => {
            handleOnSubmit(e);
          }}
        >
          IMPORT CSV
        </button>
      </form>
    </div>
  );
}

export default FileUploader;