import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react"

export interface RickandmortyCharacter {
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

// SSG透過props的方式將處理玩的data塞回component來使用
export default function Home({ apiData }: { apiData: RickandmortyCharacterRes }) {
  // CSR
  // 基本上都和你寫react沒有區別
  // const [count, setCount] = useState<number>(0);
  // const [pageInfo, setPageInfo] = useState<PageInfo>({
  //   pageUrl:'https://rickandmortyapi.com/api/character',
  //   next: null,
  //   prev: null,
  //   loading: true,
  //   curr: 0
  // });

  // if(!apiData) return (<h1>api 掛了</h1>);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageUrl:'https://rickandmortyapi.com/api/character',
    next: apiData.info.next,
    prev: apiData.info.prev,
    loading: false,
    curr: 1
  });
  const [resData, setResData] = useState<RickandmortyCharacterRes>(apiData)
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
  // 透過SSG處理fetching data的動作可以降低useFootGun的問題
  // useEffect(() => {
  //   if(!chkResData) {
  //     const controller = new AbortController();
  //     const signal = controller.signal;
  //     setPageInfo(pre => ({...pre, loading: true}));
  //     fetch(pageInfo.pageUrl, {
  //       signal: signal
  //     })
  //     .then((response) => response.json())
  //     .then((response: RickandmortyCharacterRes) => {
  //       const info = response.info
  //       // console.log(info);
  //       setResData(response)
  //       setPageInfo(pre => ({...pre, next: info.next, prev: info.prev, loading: false}))
  //     });
  //     return () => controller.abort();
  //   }
  // }, [pageInfo.pageUrl, chkResData])
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
        <div className="flex items-center w-full my-2 p-4 shadow-xl rounded-lg" key={character.id}>
          <div className="">
            <Image src={character.image} alt={character.name} width={100} height={100}/>
          </div>
          <div>
            <p>{character.name}</p>
            <Link href={`/characters/${character.id}`}>{character.id}</Link>
          </div>
        </div>
      ))}
        
    </main>
  )
}

// 下面是改用SSG的操作
// 透過getStaticProps來處理fetching data的問題
export async function getStaticProps() {
  // 這裡已經處理default值
  try{
    const res = await fetch("https://rickandmortyapi.com/api/character");
    // 我懶得處理error page原諒我先用next原生的頁面
    if (!res.ok) {
      return { notFound: true };
    }
    const apiData: RickandmortyCharacterRes = await res.json();
    return {
      props: {
        apiData,
      },
      revalidate: 10,
    };
  } catch(err) {
    console.log('err',err);
  }
}