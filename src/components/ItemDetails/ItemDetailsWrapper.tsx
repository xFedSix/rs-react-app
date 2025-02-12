import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ItemDetails from './ItemDetails';
import Loader from '../Loader/Loader';
import { Item } from '../Result/Result';

const ItemDetailsWrapper: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = new URLSearchParams(location.search);
  const itemId = searchParams.get('details');

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(
          `https://api.pokemontcg.io/v2/cards/${itemId}`
        );
        const data = await response.json();
        setSelectedItem(data.data || null);
      } catch (error) {
        setSelectedItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      setLoading(true);
      fetchItemDetails();
    } else {
      setLoading(false);
    }
  }, [itemId]);

  const handleClose = () => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete('details');
    navigate({ search: newSearchParams.toString() });
  };

  if (!itemId) return null;
  if (loading) return <Loader />;

  return selectedItem ? (
    <ItemDetails item={selectedItem} onClose={handleClose} />
  ) : (
    <div className="error-panel">
      Error loading details
      <button onClick={handleClose}>Close</button>
    </div>
  );
};

export default ItemDetailsWrapper;
