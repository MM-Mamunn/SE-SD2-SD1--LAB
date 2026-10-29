import React from 'react'
import { Link } from 'react-router-dom'

function Nav() {
  return (
    <>
       <nav className="mb-4 flex gap-4 text-blue-500 underline">
        <Link to="/group1/home">Home</Link>
        <Link to="/group1/about">About</Link>
        <Link to="/group2/dashboard">Dashboard</Link>
      </nav>
    </>
  )
}

export default Nav
