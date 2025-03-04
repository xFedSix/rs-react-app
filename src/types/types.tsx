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

export interface AppProps {
  initialData: {
    data: Item[];
    totalCount: number;
  };
}

export interface ResultsProps {
  items?: Item[] | Item;
  error?: string | null;
  onItemClick: (item: Item) => void;
}
