"use client"
import React, { useCallback, useState } from 'react'
import { RickandmortyCharacterRes } from '../../../typings'
import Image from 'next/image'
import Link from 'next/link'

const CharasList = ({
  listInfo
}:{
  listInfo: RickandmortyCharacterRes
}) => {
  const [pageInfo, setPageInfo] = useState({
    pageUrl:'https://rickandmortyapi.com/api/character',
    next: listInfo.info.next,
    prev: listInfo.info.prev,
    loading: false,
    curr: 1
  });
  const [charasList, setCharasList] = useState(listInfo.results);
  const pageChange = useCallback((status: string) => {
    // console.log(pageInfo);
    setPageInfo(pre => ({...pre, loading: true}));
    if (status === 'next') {
      // console.log(pageInfo);
      fetch(pageInfo.next!)
      .then((response) => response.json())
      .then((response: RickandmortyCharacterRes) => {
        const info = response.info
        setCharasList(response.results)
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
        setCharasList(response.results)
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
    <>
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
      {charasList?.map((char) => (
        <div className="flex items-center w-full my-2 p-4 shadow-xl rounded-lg" key={char.id}>
          <div className="">
            <Image src={char.image} alt={char.name} width={100} height={100}/>
          </div>
          <div>
            <p>{char.name}</p>
            <Link href={`/charas/${char.id}`}>{char.id}</Link>
          </div>
        </div>
      ))}
    </>
  )
}

export default CharasList
