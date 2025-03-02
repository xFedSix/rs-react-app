import App, { AppProps } from './App';

const AppWrapper: React.FC<AppProps> = ({ initialData }) => {
  return <App initialData={initialData} />;
};

export default AppWrapper;
