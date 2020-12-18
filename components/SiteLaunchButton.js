import React from "react";

export default function SiteLaunchButton(siteData) {
  if (siteData.Outputs) {
    const siteUrl = `https://${siteData.Outputs[0].OutputValue}`;

    const handleClick = (e) => {
      window.open(`${siteUrl}`);
    };

    if (['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(siteData.StackStatus)) {
      return (
        <button onClick={handleClick} style={{backgroundColor: 'white', border: 0, padding: 0}}>
          <img src="/static/images/buttons/launch.png" alt="Launch Test Site" width="121" height="46" />
        </button>
      );
    }
  }
}