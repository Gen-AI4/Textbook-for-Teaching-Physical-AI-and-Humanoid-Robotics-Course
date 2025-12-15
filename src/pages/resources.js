import Layout from '@theme/Layout';
import { Redirect } from '@docusaurus/router';

// This page redirects to the resources docs page
export default function Resources() {
  return <Redirect to="/docs/resources" />;
}