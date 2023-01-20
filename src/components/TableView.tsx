import React, { useState } from "react";

interface TableViewProps {
  header: any[];
  rows: any[];
}
 
function TableView({header, rows}: TableViewProps) {

  const headerKeys = Object.keys(Object.assign({}, ...rows));
 
  return (
    <div style={{ textAlign: "center", height: "200px", overflowY: "scroll", backgroundColor: "lightgray" }}> 
      <table>
        <thead>
          <tr key={"header"}>
            {headerKeys.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((item: any) => (
            <tr key={item.id}>
              {Object.values(item).map((val: any) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;