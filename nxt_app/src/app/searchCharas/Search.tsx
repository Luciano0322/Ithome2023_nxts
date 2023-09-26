import { useRouter } from 'next/navigation'
import { FormEvent, useRef } from 'react'

const Search = () => {
  const searchTerm = useRef(null);
  const router = useRouter();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/searchCharas/${searchTerm.current}`)
  }
  return (
    <form onSubmit={handleSearch}>
      <input 
        className='p-2 border-b-2 border-gary-200 mx-2'
        type="text" 
        placeholder="Pokemon's name"
        ref={searchTerm}
      />
      <button
        type='submit'
        className='bg-blue-500 text-white font-bold py-2 px-4 rounded-lg'
      >
        Search
      </button>
    </form>
  )
}

export default Search