import { Header } from '@/app/layout/Header'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default Home
