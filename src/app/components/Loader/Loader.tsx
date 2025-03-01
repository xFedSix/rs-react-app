import './Loader.css';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const Loader: React.FC<LoaderProps> = (props) => {
  return (
    <div className="loader" {...props}>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
