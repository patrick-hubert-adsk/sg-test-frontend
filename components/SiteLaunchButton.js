import React from "react";

export default function SiteLaunchButton(data) {
  if (data.Outputs) {
    const siteUrl = `https://${data.Outputs[0].OutputValue}`;
    return (
      <a target="_blank" href={siteUrl} variant="contained">
        <img src="/static/images/buttons/launch.png" alt="Launch Test Site" width="121" height="46" style={{}} />
      </a>
    );
  }
}
