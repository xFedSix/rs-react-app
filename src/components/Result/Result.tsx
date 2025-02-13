import { useSelector, useDispatch } from 'react-redux';
import { RootState, updateSelectedItems } from '../../Store/Store';
import './Result.scss';
import { useEffect } from 'react';

export interface Item {
  id: number | string;
  name: string;
  images: {
    small: string;
    large: string;
  };
  flavorText: string | undefined;
}

export interface ResultsProps {
  items: Item[] | Item;
  error: string | null;
  onItemClick: (item: Item) => void;
}

const Result = ({ onItemClick }: ResultsProps) => {
  const dispatch = useDispatch();
  const { items, error, selectedItems } = useSelector(
    (state: RootState) => state.results
  );

  useEffect(() => {}, [items, error]);

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
    <tr key={item.id} onClick={() => onItemClick(item)}>
      <td>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id={`pokemon-${item.id}`}
            onChange={(e) => {
              if (e.target && e.target.checked) {
                dispatch(updateSelectedItems([...selectedItems, item]));
              } else {
                dispatch(
                  updateSelectedItems(
                    selectedItems.filter(
                      (selectedItem) => selectedItem.id !== item.id
                    )
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
      <td>{item.name}</td>
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
                  value=""
                  id="selectAll"
                  onChange={(event) => {
                    const target = event.target as HTMLInputElement;
                    if (target.checked) {
                      dispatch(updateSelectedItems(items));
                    } else {
                      dispatch(updateSelectedItems([]));
                    }
                  }}
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
