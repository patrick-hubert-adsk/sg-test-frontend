import React from 'react';

export default function SiteDeleteButton(siteData) {
  const handleClick = (e) => {
    fetch('/api/deleteTestSite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        siteName: siteData.StackName.slice(11),
      })
    });
  };

  if (['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(siteData.StackStatus)) {
    return (
      <button onClick={handleClick} style={{backgroundColor: 'white', border: 0, padding: 0}}>
        <img src="/static/images/buttons/delete2.png" alt="Delete Test Site" width="121" height="46" />
      </button>
    );
  }
}
