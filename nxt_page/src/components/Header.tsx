import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between align-center p-2'>
      <div><Link href={`/`}>Rick and morty</Link></div>
      <ul>
        <li><Link href={`/location`}>location</Link></li>
      </ul>
    </div>
  )
}

export default Header
