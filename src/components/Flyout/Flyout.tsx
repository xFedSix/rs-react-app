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
    const data = JSON.stringify(selectedItems, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selected-pokemon.json';
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
