import Layout from '@theme/Layout';
import { Redirect } from '@docusaurus/router';

// This page redirects to the about docs page
export default function About() {
  return <Redirect to="/docs/about" />;
}