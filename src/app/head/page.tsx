export const metadata = {
  title: 'Pokemon App',
  description: 'Search for pokemons!'
};

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
  return <link rel="icon" type="image/svg+xml" href="/next.js.svg" />;
};

export default CustomHead;
