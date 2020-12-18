import React from 'react';

export default function RefreshButton({mutate}) {
  return (
    <button onClick={() => mutate()} style={{backgroundColor: 'white', border: 0, padding: 0, cursor: "pointer"}}>
      <img src="/static/images/buttons/refresh.png" alt="Update Test Site" width="25" height="25" />
    </button>
  );
}
