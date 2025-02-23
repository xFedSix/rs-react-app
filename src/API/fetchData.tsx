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

    return {
      data: data.data,
      totalCount: data.totalCount ?? data.count ?? 0
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred');
  }
};
