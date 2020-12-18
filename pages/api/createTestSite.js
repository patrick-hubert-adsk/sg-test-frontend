import Amplify, { API } from 'aws-amplify';
import awsconfig from '../../src/aws-exports';

Amplify.configure(awsconfig);

export default (req, res) => {
  try {
    const {
      siteName, branch
    } = req.body;

    API.post('sgtestapi', '/site', {body: {app_tag: branch, site_name: siteName}});
    res.status(200).json({ result: 'ok' });
  } catch (e) {
    // something went wrong
    res.status(500).json({ error: e.message });
  }
}
