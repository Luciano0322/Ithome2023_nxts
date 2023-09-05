import { useCallback, useEffect, useMemo, useState } from "react"

interface RickandmortyCharacter {
  id: number,
  name: string,
  status: string,
  species: string,
  type: string,
  gender: string,
  origin: {
    name: string,
    url: string
  },
  location: {
    name: string,
    url: string
  },
  image: string,
  episode: string[],
  url: string,
  created: string,
}
interface RickandmortyCharacterRes {
  info: {
    count: number,
    pages: number,
    next: string | null,
    prev: string | null,
  },
  results: RickandmortyCharacter[]
}

interface PageInfo {
  pageUrl: string;
  next: string | null;
  prev: string | null;
  curr: number;
  loading: boolean;
}

export default function Home() {
  // 基本上都和你寫react沒有區別
  // const [count, setCount] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageUrl:'https://rickandmortyapi.com/api/character',
    next: null,
    prev: null,
    loading: true,
    curr: 0
  });
  const [resData, setResData] = useState<RickandmortyCharacterRes|null>(null)
  const chkResData = useMemo(() => resData ,[resData])
  const pageChange = useCallback((status: string) => {
    // console.log(pageInfo);
    setPageInfo(pre => ({...pre, loading: true}));
    if (status === 'next') {
      // console.log(pageInfo);
      fetch(pageInfo.next!)
      .then((response) => response.json())
      .then((response: RickandmortyCharacterRes) => {
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
      .then((response: RickandmortyCharacterRes) => {
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
  
  useEffect(() => {
    if(!chkResData) {
      const controller = new AbortController();
      const signal = controller.signal;
      setPageInfo(pre => ({...pre, loading: true}));
      fetch(pageInfo.pageUrl, {
        signal: signal
      })
      .then((response) => response.json())
      .then((response: RickandmortyCharacterRes) => {
        const info = response.info
        // console.log(info);
        setResData(response)
        setPageInfo(pre => ({...pre, next: info.next, prev: info.prev, loading: false}))
      });
      return () => controller.abort();
    }
  }, [pageInfo.pageUrl, chkResData])
  return (
    <main className="container mx-auto">
      <h2>這裡會是首頁主要內容</h2>
      {/* <div className="flex justify-center items-center">
        <button 
          className="p-2 mx-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-300 disabled:bg-gray-100 min-w-40"
          onClick={() => setCount(pre=> pre-=1)}
          disabled={count===0} >-</button>
        <div>{count}</div>
        <button 
          className="p-2 mx-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-300 min-w-40"
          onClick={() => setCount(pre=> pre+=1)}>+</button>
      </div> */}
      <div>資料頁面</div>
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
      {resData?.results?.map((character) => (
        <div key={character.id}>
          {character.name}
        </div>
      ))}
    </main>
  )
}
