// pages/index.tsx
import Map from '@/components/map';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Mapbox Globe</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css" rel="stylesheet" />
      </Head>
      <div style={{ width: '100%', height: '100vh' }}>
        <Map />
      </div>
    </>
  );
}
