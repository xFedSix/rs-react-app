import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Item } from '../../types/types';
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
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [item]);

  const handleCloseDetails = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('details');

    router.push(`${pathname}?${newSearchParams.toString()}`, undefined, {
      shallow: true
    });
    onClose();
  }, [router, onClose, searchParams, pathname]);

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
