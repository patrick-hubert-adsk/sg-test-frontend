import React from 'react';

export default function SiteUpdateButton(siteData) {
  if (['CREATE_COMPLETE', 'UPDATE_COMPLETE'].includes(siteData.StackStatus)) {
    return (
      <a variant="contained">
        <img src="/static/images/buttons/update.png" alt="Update Test Site" width="121" height="46" />
      </a>
    );
  }
}
