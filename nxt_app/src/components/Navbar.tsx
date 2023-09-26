import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-2 min-h-60 bg-blue-400">
      <div><Link href={`/`}>home</Link></div>
      <ul className="flex items-center">
        <li className="mx-4 bg-white rounded-lg p-2 shadow-sm"><Link href={`/charas`}>角色</Link></li>
        <li className="mx-4 bg-white rounded-lg p-2 shadow-sm"><Link href={`/searchCharas`}>搜尋角色</Link></li>
        <li className="mx-4 bg-white rounded-lg p-2 shadow-sm"><Link href={`/locations`}>地點</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
