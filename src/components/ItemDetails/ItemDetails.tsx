import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Item } from '../Result/Result';
import Loader from '../Loader/Loader';
import { fetchItemDetails } from '../../utils/pokemonApi';

interface ItemDetailsProps {
  item: Item;
  onClose: () => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onClose }) => {
  const [details, setDetails] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!item || !item.id) {
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const result = await fetchItemDetails(item.id.toString());
        setDetails(result);
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [item]);

  const handleCloseDetails = useCallback(() => {
    const currentQuery = { ...router.query };
    delete currentQuery.details;
    router.push(
      {
        pathname: router.pathname,
        query: currentQuery
      },
      undefined,
      { shallow: true }
    );
    onClose();
  }, [router, onClose]);

  if (loading) {
    return <Loader />;
  }

  if (!details) {
    return <div>No details available.</div>;
  }

  return (
    <div className="item-details">
      <button onClick={handleCloseDetails}>Close</button>
      <h2>{details.name}</h2>
      <img
        className="details-img"
        src={details.images?.large}
        alt={details.name}
      />
      <p>{details.flavorText}</p>
    </div>
  );
};

export default ItemDetails;
