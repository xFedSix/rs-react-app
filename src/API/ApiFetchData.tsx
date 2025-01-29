export const fetchData = async (
  searchQuery: string,
  endpoint: string,
  offset: number,
  limit: number
) => {
  let url = `https://pokeapi.co/api/v2/${endpoint}?offset=${offset}&limit=${limit}`;

  if (searchQuery) {
    url = `${searchQuery}?offset=${offset}&limit=${limit}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data.results;
};
