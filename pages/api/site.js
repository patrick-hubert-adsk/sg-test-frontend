import Amplify, { API } from 'aws-amplify';
import awsconfig from '../../src/aws-exports';

Amplify.configure(awsconfig);

export const fetchSites = async () => {
  return await API.get('sgtestapi', '/site');
}

export default async (req, res) => {
  try {
    res.status(200).json(await fetchSites());
  } catch (e) {
    // something went wrong
    res.status(500).json({ error: e.message });
  }
}
