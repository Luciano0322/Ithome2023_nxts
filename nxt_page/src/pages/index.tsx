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

export default function Home() {
  // 基本上都和你寫react沒有區別
  const [count, setCount] = useState<number>(0);
  const [dataUrl, setDataurl] = useState<string>('https://rickandmortyapi.com/api/character');
  const [resData, setResData] = useState<RickandmortyCharacterRes|null>(null)
  const pageChange = (status: string) => {
    if (resData) {
      if (status === 'next') {
        setDataurl(resData.info.next as string);
        setCount(pre => pre += 1)
      }
      if (status === 'prev') {
        setDataurl(resData.info.prev as string);
        setCount(pre => pre -= 1)
      }
    }
  }
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    fetch(dataUrl, {
      signal: signal
    })
    .then((response) => response.json())
    .then((response) => {
      setResData(response)
    });
    return () => controller.abort();
  }, [dataUrl, resData])
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
          disabled={resData?.info.prev===null} >-</button>
        <div>{count}</div>
        <button 
          className="p-2 mx-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-300 min-w-40"
          onClick={() => pageChange('next')}
          disabled={resData?.info.next===null}>+</button>
      </div>
      {resData?.results?.map((character) => (
        <div key={character.id}>
          {character.name}
        </div>
      ))}
    </main>
  )
}
