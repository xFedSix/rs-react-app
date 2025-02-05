export const fetchData = async (
  searchQuery = '',
  page = 1,
  pageSize = 9,
  orderBy = '',
  select = ''
) => {
  const baseUrl = 'https://api.pokemontcg.io/v2/cards';
  const queryString = searchQuery ? `q=name:${searchQuery}*` : '';
  const url = `${baseUrl}?page=${page}&pageSize=${pageSize}${
    queryString ? `&${queryString}` : ''
  }${orderBy ? `&orderBy=${orderBy}` : ''}${select ? `&select=${select}` : ''}`;

  console.log('Constructed URL:', url);

  try {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      throw new Error('API key is missing');
    }
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey
      }
    });
    console.log('response:', response);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error('Error occurred in fetchData:', error);
    throw error;
  }
};
