import React from 'react';
import { Outlet } from 'react-router-dom';
import Main from '../Main/Main';
import { Item } from '../Result/Result';

interface MainContentProps {
  isLoading: boolean;
  onItemClick: (item: Item) => void;
  onClick: () => void;
}

const MainContent: React.FC<MainContentProps> = ({
  isLoading,
  onItemClick,
  onClick
}) => {
  return (
    <div className="split-view">
      <div className="main-content" onClick={onClick}>
        <Main
          isLoading={isLoading}
          onItemClick={onItemClick}
          onClick={onClick}
        />
      </div>
      <div className="details-panel">
        <Outlet />
      </div>
    </div>
  );
};

export default MainContent;
