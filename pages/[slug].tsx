
import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { TOOLS } from '../constants';
import ToolDetail from '../components/ToolDetail'; // Corrected path to components folder

// This will be a catch-all for tools not explicitly defined in other files
const DynamicToolPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const tool = TOOLS.find(t => t.slug === slug);

  if (!router.isReady) return null;
  if (!tool) return <div className="text-center py-20"><h2>Tool Not Found</h2></div>;

  return (
    <>
      <Head>
        <title>{tool.name} | PakUtility</title>
        <meta name="description" content={tool.description} />
      </Head>
      <ToolDetail />
    </>
  );
};

export default DynamicToolPage;
