import React, { useEffect, useState } from 'react';
import { Item } from '../Result/Result';
import Loader from '../Loader/Loader';
import './ItemDetails.scss';

interface ItemDetailsProps {
  item: Item;
  onClose: () => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onClose }) => {
  const [details, setDetails] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!item || !item.id) {
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `https://api.pokemontcg.io/v2/cards/${item.id}`
        );
        const data = await response.json();
        if (data.error) {
          setDetails(null);
        } else {
          setDetails(data.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [item]);

  if (loading) {
    return <Loader />;
  }

  if (!details) {
    return <div>No details available.</div>;
  }

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
