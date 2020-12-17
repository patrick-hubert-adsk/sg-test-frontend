import React from 'react';
import Button from '@material-ui/core/Button';

export default function SiteLaunchButton(data) {
    if (data.Outputs) {
      const siteUrl = `https://${data.Outputs[0].OutputValue}`;
      return (
        <Button target='_blank' href={siteUrl} variant="contained">Launch</Button>
      );
    }
  }
