import React, { useCallback, useState } from 'react'
import { PageInfo } from '..';
import Header from '@/components/Header';

interface RickandmortyLocation {
  id:	number;
  name:	string;
  type:	string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

interface RickandmortyLocationRes {
  info: {
    count: number,
    pages: number,
    next: string | null,
    prev: string | null,
  },
  results: RickandmortyLocation[]
}

const Location = ({ apiData }:{ apiData: RickandmortyLocationRes}) => {
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageUrl:'https://rickandmortyapi.com/api/character',
    next: apiData.info.next,
    prev: apiData.info.prev,
    loading: false,
    curr: 1
  });
  const [resData, setResData] = useState<RickandmortyLocationRes>(apiData)
  const pageChange = useCallback((status: string) => {
    // console.log(pageInfo);
    setPageInfo(pre => ({...pre, loading: true}));
    if (status === 'next') {
      // console.log(pageInfo);
      fetch(pageInfo.next!)
      .then((response) => response.json())
      .then((response: RickandmortyLocationRes) => {
        const info = response.info
        setResData(response)
        setPageInfo(pre => ({
          ...pre, 
          next: info.next, 
          pageUrl: pageInfo.next!,
          prev: info.prev, 
          curr: pre.curr + 1, 
          loading: false
        }))
      });
    }
    if (status === 'prev') {
      fetch(pageInfo.prev!)
      .then((response) => response.json())
      .then((response: RickandmortyLocationRes) => {
        const info = response.info
        setResData(response)
        setPageInfo(pre => ({
          ...pre, 
          next: info.next, 
          pageUrl: pageInfo.prev!,
          prev: info.prev, 
          curr: pre.curr - 1, 
          loading: false
        }))
      });
    }
  }, [pageInfo])
  return (
    <div>
      <Header/>
      <h2>Location Page</h2>
      <div className="flex justify-center items-center">
        <button 
          className="p-2 mx-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-300 disabled:bg-gray-100 min-w-40"
          onClick={() => pageChange('prev')}
          disabled={pageInfo.prev===null || pageInfo.loading} >prev</button>
        <div>{pageInfo.curr}</div>
        <button 
          className="p-2 mx-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-300 min-w-40"
          onClick={() => pageChange('next')}
          disabled={pageInfo.next===null || pageInfo.loading}>next</button>
      </div>
      <div>
        {resData?.results?.map((locate) => (
          <div key={locate.id}>
            <p>{locate.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  try{
    const res = await fetch("https://rickandmortyapi.com/api/location");
    if (!res.ok) {
      return { notFound: true };
    }
    const apiData: RickandmortyLocationRes = await res.json();
    return {
      props: {
        apiData,
      },
    };
  } catch(err) {
    console.log('err',err);
  }
}

export default Location
