// "use client" // 你不能同時用async component和hooks
import React from 'react'
import { RickandmortyCharacterRes } from '../../../typings'
import Link from 'next/link'
import Image from 'next/image'
import CharasList from './CharasList'

// 現在可以不用再透過getServerSideProps來處理 fetch Data
// 可以直接對 component 下 async 然後 await 你的 fetcher
const charasFetcher = async (url: string) => {
  const res = await fetch(url)
  const charasData: RickandmortyCharacterRes = await res.json()
  return charasData;
}

let currPage = `https://rickandmortyapi.com/api/character`

// 你要思考拆出client component
const Charas = async () => {
  // 這裡只解決first load
  const charasRes = await charasFetcher(currPage) 
   
  return (
    <div>
      charas page
      <CharasList listInfo={charasRes} />
    </div>
  )
}

export default Charas
