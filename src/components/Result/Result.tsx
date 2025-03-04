import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../Store/Store';
import { updateSelectedItems } from '../../Store/resultsSlice';
import React, { useCallback, useEffect, useState } from 'react';
import { Item } from '../../types/types';
import { ResultProps } from '../../types/types';

export const Result: React.FC<ResultProps> = ({ items, onItemClick }) => {
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.results.selectedItems
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  useEffect(() => {
    setSelectAllChecked(selectedItems.length === items.length);
  }, [selectedItems, items]);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const newSelection = Array.isArray(items)
          ? items.map((item) => ({
              id: item.id,
              name: item.name,
              images: item.images,
              flavorText: item.flavorText
            }))
          : [];
        dispatch(updateSelectedItems(newSelection));
      } else {
        dispatch(updateSelectedItems([]));
      }
      setSelectAllChecked(checked);
    },
    [items, dispatch]
  );
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
        <img
          className="card-img"
          src={item.images.small}
          alt={item.name}
          onClick={() => onItemClick(item)}
        />
      </td>
      <td onClick={() => onItemClick(item)}>{item.name}</td>
      <td>
        {item.flavorText && item.flavorText.trim() !== ''
          ? item.flavorText
          : 'No information'}
      </td>
    </tr>
  );
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
