import Head from 'next/head';

interface CustomHeadProps {
  title: string;
  description?: string;
  keywords?: string;
}

const CustomHead: React.FC<CustomHeadProps> = ({
  title,
  description,
  keywords
}) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="icon" type="image/svg+xml" href="/next.js.svg" />
    </Head>
  );
};

export default CustomHead;
