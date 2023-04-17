import { useInfiniteQuery } from 'react-query';
import './App.css';
import fetchData from './utils/fetchData';
import { useCallback, useMemo, useRef } from 'react';

function App() {
  const { data, error, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useInfiniteQuery('projects', fetchData, {
      getNextPageParam: (lastPage, pages) => lastPage.offset,
    });

  const flattenedData = useMemo(
    () => (data ? data?.pages.flatMap(item => item.results) : []),
    [data]
  );

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage]
  );

  if (isLoading) return <h1>Loading Data</h1>;

  if (error) return <h1>Couldn't fetch data</h1>;

  return (
    <div>
      <div>
        {flattenedData.map((item, i) => (
          <div
            key={i}
            ref={flattenedData.length === i + 1 ? lastElementRef : null}>
            <p>{item.name}</p>
          </div>
        ))}
      </div>
      {isFetching && <div>Fetching more data</div>}
    </div>
  );
}

export default App;
