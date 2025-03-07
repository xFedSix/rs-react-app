import React from 'react';
import Main from '../Main/Main';
import { Item } from '../../types/types';
import ItemDetails from '../ItemDetails/ItemDetails';

interface MainContentProps {
  isLoading: boolean;
  onItemClick: (item: Item) => void;
  selectedItem: Item | null;
  onCloseDetails: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  isLoading,
  onItemClick,
  selectedItem,
  onCloseDetails
}) => {
  return (
    <div className="main-content">
      <Main isLoading={isLoading} onItemClick={onItemClick} />
      <div className="details-panel">
        {selectedItem && (
          <ItemDetails item={selectedItem} onClose={onCloseDetails} />
        )}
      </div>
    </div>
  );
};

export default MainContent;
