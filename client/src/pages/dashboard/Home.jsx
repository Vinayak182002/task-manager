import React from 'react'
import useAuth from '../../constants/useAuth'

export default function Home() {
  useAuth();
  return (
    <div>
      <h1>This is the Home Page</h1>
    </div>
  )
}
