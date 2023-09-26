import React from 'react'
import { RickandmortyCharacter, RickandmortyCharacterRes } from '../../../../typings'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type PageProps = {
  params: {
    charID: string
  }
}

const fetchCharacter = async (id: string) => {
  try{
    const res = await fetch(
      `https://rickandmortyapi.com/api/character/${id}`,
      { next: { revalidate: 60 } } // 這裡保有 ISR 的作法
      );
    if(!res.ok){
      const message = `An error occured: ${res.status}`;
      throw new Error(message);
    }
    const characterInfo: RickandmortyCharacter = await res.json();
    return characterInfo
  } catch(err) {
    console.log(err);
  }
} 

const CharPage = async ({params: { charID }}:PageProps) => {
  const character = await fetchCharacter(charID);

  if (!character) notFound();

  return (
    <div>
      <h2>here is {charID}</h2>
      <div>
        <p>Name: {character.name}</p>
        <p>status: {character.status}</p>
        <p>species: {character.species}</p>
        <p>gender: {character.gender}</p>
        <p>origin: {character.origin.name}</p>
        <p>location: {character.location.name}</p>
      </div>
      <Link 
        className="p-2 mx-2 rounded-lg shadow-md bg-blue-500 hover:bg-blue-300 disabled:bg-gray-100 min-w-40"
        href={'/charas'}
      >back</Link>
    </div>
  )
}

export default CharPage

// 這邊為了預先產出靜態檔案而做的處理
export const generateStaticParams = async () => {
  const res = await fetch('https://rickandmortyapi.com/api/character');
  const listData: RickandmortyCharacterRes = await res.json();
  return listData.results.map((character) => ({charID: character.id}))
}
