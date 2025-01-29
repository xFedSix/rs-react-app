export const fetchData = async (
  searchQuery: string,
  endpoint: string,
  offset: number,
  limit: number
) => {
  let url = searchQuery
    ? `${searchQuery}?offset=${offset}&limit=${limit}`
    : `https://pokeapi.co/api/v2/${endpoint}?offset=${offset}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  console.log('Fetched data:', data);
  return data.results || data;
};
