"use client";

import { useRouter } from 'next/navigation'
import { FormEvent, useRef } from 'react'

const Search = () => {
  const searchTerm = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const str = searchTerm.current
    router.push(`/searchCharas/${str?.value}`)
  }
  return (
    <form onSubmit={handleSearch}>
      <div>
        <input 
          className='p-2 border-b-2 border-gary-200 mx-2'
          type="text" 
          placeholder="Insert character's name"
          ref={searchTerm}
        />
      </div>
      <button
        type='submit'
        className='bg-blue-500 text-white font-bold py-2 px-4 rounded-lg my-2'
      >
        Search
      </button>
    </form>
  )
}

export default Search