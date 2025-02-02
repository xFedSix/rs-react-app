export const fetchData = async (
  searchQuery: string,
  endpoint: string,
  offset: number,
  limit: number
) => {
  let url = searchQuery
    ? `https://pokeapi.co/api/v2/${endpoint}/${searchQuery}`
    : `https://pokeapi.co/api/v2/${endpoint}?offset=${offset}&limit=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Error occurred in fetchData:', error);
    throw error;
  }
};
