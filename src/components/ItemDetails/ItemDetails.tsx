import { useLoaderData } from 'react-router-dom';

import { Item } from '../Result/Result';

interface ItemDetailsProps {
  item: Item[];
  onClose: () => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ onClose }) => {
  const item = useLoaderData() as Item;

  return (
    <div className="item-details">
      <button onClick={onClose}>Close</button>
      <h2>{item.name}</h2>
      <img className="details-img" src={item.images.large} alt={item.name} />
      <p>{item.flavorText}</p>
    </div>
  );
};

export default ItemDetails;
