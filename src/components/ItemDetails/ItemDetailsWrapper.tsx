import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ItemDetails from './ItemDetails';
import Loader from '../Loader/Loader';
import { Item } from '../Result/Result';

const ItemDetailsWrapper: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const itemId = searchParams.get('details');

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(
          `https://api.pokemontcg.io/v2/cards/${itemId}`
        );
        const data = await response.json();
        if (data.error) {
          setError('Error loading details');
          setSelectedItem(null);
        } else {
          setSelectedItem(data.data);
        }
      } catch (error) {
        setError('Error loading details');
        setSelectedItem(null);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItemDetails();
    } else {
      setLoading(false);
    }
  }, [itemId]);

  const handleCloseDetails = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('details');
    navigate(`/?${searchParams.toString()}`);
  }, [navigate, location.search]);

  if (!itemId) return null;
  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return selectedItem ? (
    <ItemDetails item={selectedItem} onClose={handleCloseDetails} />
  ) : (
    <div>No details available.</div>
  );
};

export default ItemDetailsWrapper;
