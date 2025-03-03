import React from 'react';
import Main from '../Main/Main';
import { Item } from '../Result/Result';
import ItemDetails from '../ItemDetails/ItemDetails';

interface MainContentProps {
  isLoading: boolean;
  onItemClick: (item: Item) => void;
  onClick: () => void;
  selectedItem: Item | null;
  onCloseDetails: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  isLoading,
  onItemClick,
  onClick,
  selectedItem,
  onCloseDetails
}) => {
  return (
    <div className="main-content" onClick={onClick}>
      <Main isLoading={isLoading} onItemClick={onItemClick} onClick={onClick} />
      <div className="details-panel">
        {selectedItem && (
          <ItemDetails item={selectedItem} onClose={onCloseDetails} />
        )}
      </div>
    </div>
  );
};

export default MainContent;
