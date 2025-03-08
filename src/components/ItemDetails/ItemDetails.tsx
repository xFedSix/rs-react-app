import { useLoaderData } from 'react-router-dom';
import type { detailsLoader } from '../loaders/detailsLoader';
import './ItemDetails.scss';

interface ItemDetailsProps {
  item: Item;
  onClose: () => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ onClose }) => {
  const { item } = useLoaderData<typeof detailsLoader>();

  return (
    <div className="item-details">
      <button onClick={onClose}>Close</button>
      <h2>{details.name}</h2>
      <img
        className="details-img"
        src={details.images.large}
        alt={details.name}
      />
      <p>{details.flavorText}</p>
    </div>
  );
};

export default ItemDetails;
