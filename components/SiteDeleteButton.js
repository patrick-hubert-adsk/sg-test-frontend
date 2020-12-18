import React from 'react';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function SiteDeleteButton({siteData, mutate}) {
  const handleClick = async (e) => {
    await fetch('/api/deleteTestSite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        siteName: siteData.StackName.slice(11),
      })
    });
    await sleep(2000);
    mutate();
  };

  if (['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(siteData.StackStatus)) {
    return (
      <button onClick={handleClick} style={{backgroundColor: 'white', border: 0, padding: 0, cursor: "pointer"}}>
        <img src="/static/images/buttons/delete2.png" alt="Delete Test Site" width="121" height="46" />
      </button>
    );
  }
  return (
    <button style={{backgroundColor: 'white', border: 0, padding: 0, opacity: 0.25}}>
      <img src="/static/images/buttons/delete2.png" alt="Delete Test Site" width="121" height="46" />
    </button>
  );
}
