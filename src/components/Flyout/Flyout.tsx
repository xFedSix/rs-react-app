import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Store/Store';
import { updateSelectedItems } from '../../Store/resultsSlice';
import './Flyout.scss';

const Flyout: React.FC = () => {
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.results.selectedItems
  );

  if (selectedItems.length === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(updateSelectedItems([]));
  };

  const handleDownload = () => {
    const headers = [
      'ID',
      'Name',
      'HP',
      'Evolves From',
      'Rarity',
      'Artist',
      'Flavor Text',
      'Image URL'
    ].join(',');

    const rows = selectedItems.map((item) =>
      [
        item.id,
        item.name,
        item.hp,
        item.evolvesFrom || '',
        item.rarity,
        item.artist,
        item.flavorText?.replace(/"/g, '""') || '',
        item.images?.large || ''
      ]
        .map((value) => `"${value}"`)
        .join(',')
    );

    const csvContent = [headers, ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedItems.length}_pokemons.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flyout">
      <span>{selectedItems.length} items are selected</span>
      <div className="flyout-buttons">
        <button onClick={handleUnselectAll}>Unselect all</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
};

export default Flyout;
