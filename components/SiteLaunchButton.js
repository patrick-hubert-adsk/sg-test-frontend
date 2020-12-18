import React from "react";

export default function SiteLaunchButton({siteData}) {
  let buttonImage;
  let opacity = 0.25;
  let cursor = 'default'
  switch(siteData.StackStatus) {
    case 'CREATE_COMPLETE':
    case 'UPDATE_COMPLETE':
      buttonImage = '/static/images/buttons/launch.png';
      opacity = 100;
      cursor = 'pointer'
      break;
    case 'DELETE_IN_PROGRESS':
      buttonImage = '/static/images/buttons/deleting.png';
      break;
    case 'CREATE_IN_PROGRESS':
      buttonImage = '/static/images/buttons/creating.png';
      break;
    default:
      buttonImage = '/static/images/buttons/unavailable.png';
  }

  const handleClick = (e) => {
    if (siteData.Outputs && opacity == 100) {
      const siteUrl = `https://${siteData.Outputs[0].OutputValue}`;
      window.open(`${siteUrl}`);
    }
  };

  return (
    <button onClick={handleClick} style={{backgroundColor: 'white', border: 0, padding: 0, cursor: cursor, opacity: opacity}}>
      <img src={buttonImage} alt="Launch Test Site" width="121" height="46" />
    </button>
  );
}