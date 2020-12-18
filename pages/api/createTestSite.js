export default (req, res) => {
  try {
    const {
      query: { siteName, branch }
    } = req

    console.log("Before");
    console.dir(siteName);
    console.log("After");
    // const result = await fetch(`${backendUrl}/trips`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // });

    // if (result.status >= 300) {
    //   return res.status(500).json({ error: 'nok' });
    // }

    // const { trip: newTrip }: { trip: Trip } = await result.json();

    // ok
    res.status(200).json({ result: 'ok' });
  } catch (e) {
    // something went wrong
    res.status(500).json({ error: e.message });
  }
}


// import Amplify, { API } from 'aws-amplify';
// import awsconfig from '../src/aws-exports';

// Amplify.configure(awsconfig);

// function createSite(site_name, branch) {
//   const apiName = 'sgtestapi';
//   const path = '/site';
//   const myInit = {
//     body: {app_tag: branch, site_name: site_name}
//   };

//   return API.post(apiName, path, myInit);
// }
