import React from 'react'
import { RickandmortyCharacterRes } from '../../../../typings';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

type PageProps = {
  params: {
    searchTerm: string,
  },
}

const searchCharacters = async (params: string) => {
  try{
    const res = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${params}`,
      { next: { revalidate: 60 } } 
      );
    if(!res.ok){
      const message = `An error occured: ${res.status}`;
      throw new Error(message);
    }
    const characterInfo: RickandmortyCharacterRes = await res.json();
    return characterInfo
  } catch(err) {
    console.log(err);
  }
}

const SearchResults = async ({params: { searchTerm }}: PageProps) => {
  const searchResult = await searchCharacters(searchTerm) 
  if(!searchResult) return notFound();
  return (
    <div>
      {searchResult.results?.map((char) => (
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
    </div>
  )
}

export default SearchResults
