import { useEffect, useState } from "react"

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
  next: string | null,
  prev: string | null,
  curr: number;
}

export default function Home() {
  // 基本上都和你寫react沒有區別
  // const [count, setCount] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageUrl:'https://rickandmortyapi.com/api/character',
    next: null,
    prev: null,
    curr: 0
  });
  const [resData, setResData] = useState<RickandmortyCharacterRes|null>(null)
  const pageChange = (status: string) => {
    if (resData) {
      if (status === 'next') {
        setPageInfo(pre => ({...pre, pageUrl: pre?.next!, curr: pre.curr + 1 }));
      }
      if (status === 'prev') {
        setPageInfo(pre => ({...pre, pageUrl: pre?.prev!, curr: pre.curr - 1 }));
      }
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch(pageInfo.pageUrl, {
      signal: signal
    })
    .then((response) => response.json())
    .then((response: RickandmortyCharacterRes) => {
      const info = response.info
      setResData(response)
      setPageInfo(pre => ({...pre, next: info.next, prev: info.prev}))
    });
    return () => controller.abort();
  }, [pageInfo.pageUrl, resData])
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
          disabled={pageInfo.prev===null} >-</button>
        <div>{pageInfo.curr}</div>
        <button 
          className="p-2 mx-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-300 min-w-40"
          onClick={() => pageChange('next')}
          disabled={pageInfo.next===null}>+</button>
      </div>
      {resData?.results?.map((character) => (
        <div key={character.id}>
          {character.name}
        </div>
      ))}
    </main>
  )
}
