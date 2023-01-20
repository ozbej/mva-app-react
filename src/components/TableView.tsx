import React from "react";

interface TableViewProps {
  header: any[];
  rows: any[];
}
 
function TableView({header, rows}: TableViewProps) { 
  return (<>
    <h3>Table View</h3>
    <div style={{ textAlign: "center", height: "200px", overflowY: "scroll", backgroundColor: "lightgray" }}> 
      <table>
        <thead>
          <tr key={"header"}>
            {header.map((item: any) => (
              <th>{item.title}</th>
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
  </>);
}

export default TableView;