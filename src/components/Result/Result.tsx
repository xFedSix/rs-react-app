import { useSelector, useDispatch } from 'react-redux';
import { RootState, updateSelectedItems } from '../../Store/Store';
import './Result.scss';
import { useEffect, useState } from 'react';

export interface Item {
  [x: string]: any;
  id: number | string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  flavorText: string | undefined;
}

export interface ResultsProps {
  onItemClick: (item: Item) => void;
}

const Result = ({ onItemClick }: ResultsProps) => {
  const dispatch = useDispatch();
  const { items, error, selectedItems } = useSelector(
    (state: RootState) => state.results
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  useEffect(() => {
    if (Array.isArray(items)) {
      setSelectAllChecked(
        items.length > 0 &&
          items.every((item) =>
            selectedItems.some((selected) => selected.id === item.id)
          )
      );
    }
  }, [items, selectedItems]);

  if (error) {
    return (
      <div className="results-container">
        <table className="results-table">
          <tbody>
            <tr>
              <td colSpan={2}>{error}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  if (!items || (Array.isArray(items) && items.length === 0)) {
    return <div>No results found.</div>;
  }

  const renderTableRows = (item: Item) => (
    <tr key={item.id}>
      <td onClick={(e) => e.stopPropagation()}>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={`pokemon-${item.id}`}
            data-testid={`pokemon-checkbox-${item.id}`}
            aria-label={`Select ${item.name}`}
            checked={selectedItems.some((selected) => selected.id === item.id)}
            onChange={(e) => {
              e.stopPropagation();
              if (e.target.checked) {
                dispatch(updateSelectedItems([...selectedItems, item]));
              } else {
                dispatch(
                  updateSelectedItems(
                    selectedItems.filter((selected) => selected.id !== item.id)
                  )
                );
              }
            }}
          />
          <label
            className="form-check-label"
            htmlFor={`pokemon-${item.id}`}
          ></label>
        </div>
      </td>
      <td>
        <img className="card-img" src={item.images.small} alt={item.name} />
      </td>
      <td onClick={() => onItemClick(item)}>{item.name}</td>
      <td>
        {item.flavorText && item.flavorText.trim() !== ''
          ? item.flavorText
          : 'No information'}
      </td>
    </tr>
  );
  const handleSelectAll = (checked: boolean) => {
    setSelectAllChecked(checked);
    if (checked && Array.isArray(items)) {
      const currentPageItems = items as Item[];
      const newSelection = [...selectedItems];

      currentPageItems.forEach((item) => {
        if (!selectedItems.some((selected) => selected.id === item.id)) {
          newSelection.push(item);
        }
      });

      dispatch(updateSelectedItems(newSelection));
    } else {
      if (Array.isArray(items)) {
        const currentPageIds = (items as Item[]).map((item) => item.id);
        dispatch(
          updateSelectedItems(
            selectedItems.filter((item) => !currentPageIds.includes(item.id))
          )
        );
      }
    }
  };
  return (
    <div className="results-container">
      <table className="results-table">
        <thead>
          <tr>
            <th>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="selectAll"
                  data-testid="select-all-checkbox"
                  aria-label="Select all items"
                  checked={selectAllChecked}
                  onChange={(event) => handleSelectAll(event.target.checked)}
                />
                <label className="form-check-label" htmlFor="selectAll"></label>
              </div>
            </th>
            <th>Image</th>
            <th>Pokémon Name</th>
            <th>Pokémon Description</th>
          </tr>
        </thead>
        <tbody className="results-table-body">
          {Array.isArray(items)
            ? items.map(renderTableRows)
            : renderTableRows(items)}
        </tbody>
      </table>
    </div>
  );
};

export default Result;
