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

  try {
    const apiKey = import.meta.env.VITE_API_KEY;
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': apiKey
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    throw error;
  }
};
