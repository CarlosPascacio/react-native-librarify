import React, {useCallback, useMemo, createContext} from 'react';
import {useQuery, queryCache} from 'react-query';

const LibraryContext = createContext();

export default LibraryContext;

const GET_BOOKS = 'GET_BOOKS';

async function fetchData() {
  const response = await fetch('http://127.0.0.1:8000/api/books');
  const json = await response.json();
  return json;
}

export function LibraryContextProvider({children}) {
  const {isSuccess, isLoading, data} = useQuery(GET_BOOKS, fetchData);

  const invalidateBooksListCache = useCallback(function() {
    queryCache.invalidateQueries(GET_BOOKS);
  }, []);

  const value = useMemo(
    () => ({
      isSuccess,
      isLoading,
      books: data,
      invalidateBooksListCache,
    }),
    [isSuccess, isLoading, data, invalidateBooksListCache],
  );

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}
