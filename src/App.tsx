import React from 'react'
import ElectricalEquipmentPage from './components/ElectricalEquipmentPage'
import FurniturePage from './components/FurniturePage'
import NotFoundPage from './components/NotFoundPage'
import Navigation from './components/Navigation'
import RoomPage from './components/RoomPage'
import ApartmentPage from './components/ApartmentPage'
import FloorPage from './components/FloorPage'
import { createBrowserRouter, RouterProvider, Outlet, RouteObject } from 'react-router-dom'

function App() {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: (
        <div>
          <h1>KAKUV HELLO WORLD BE</h1>
          <Navigation />
          <hr />
          <Outlet />
        </div>
      )
    },
    {
      path: '/furniture',
      element: <FurniturePage />
    },
    {
      path: '/electrical-equipment',
      element: <ElectricalEquipmentPage />
    },
    {
      path: '*',
      element: <NotFoundPage />
    },
    {
      path: '/rooms',
      element: <RoomPage />
    },
    {
      path: '/apartments',
      element: <ApartmentPage />
    },
    {
      path: '/floors',
      element: <FloorPage />
    }
  ]

  const router = createBrowserRouter(routes)

  return <RouterProvider router={router} />
}

export default App
