export const fetchData = async (
  searchQuery = '',
  page = 1,
  pageSize = 9,
  orderBy = '',
  select = ''
) => {
  if (!import.meta.env.VITE_API_KEY) {
    throw new Error('API key is missing');
  }

  const baseUrl = 'https://api.pokemontcg.io/v2/cards';
  const queryString = searchQuery ? `q=name:${searchQuery}*` : '';
  const url = `${baseUrl}?page=${page}&pageSize=${pageSize}${
    queryString ? `&${queryString}` : ''
  }${orderBy ? `&orderBy=${orderBy}` : ''}${select ? `&select=${select}` : ''}`;

  console.log('Fetching data from URL:', url);

  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': import.meta.env.VITE_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw API response:', data);

    if (!data.data || !Array.isArray(data.data)) {
      console.error('Unexpected data structure:', data);
      throw new Error('Unexpected data structure received from API');
    }

    return {
      data: data.data,
      totalCount: data.totalCount ?? data.count ?? 0
    };
  } catch (error) {
    console.error('Error in fetchData:', error);
    throw error;
  }
};
