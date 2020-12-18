import Amplify, { API } from 'aws-amplify';
import awsconfig from '../../src/aws-exports';

Amplify.configure(awsconfig);

export const fetchBranches = async () => {
  return await API.get('sgtestapi', '/branch');
}

export default async (req, res) => {
  try {
    res.status(200).json(await fetchBranches());
  } catch (e) {
    // something went wrong
    res.status(500).json({ error: e.message });
  }
}
