import React from 'react';

export default function SiteUpdateButton({siteData}) {
  if (['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(siteData.StackStatus)) {
    return (
      <button style={{backgroundColor: 'white', border: 0, padding: 0, cursor: "pointer"}}>
        <img src="/static/images/buttons/update.png" alt="Update Test Site" width="121" height="46" />
      </button>
    );
  }
  return (
    <button style={{backgroundColor: 'white', border: 0, padding: 0, opacity: 0.25}}>
      <img src="/static/images/buttons/update.png" alt="Update Test Site" width="121" height="46" />
    </button>
  );
}
