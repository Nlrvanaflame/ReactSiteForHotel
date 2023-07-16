import React from 'react';
import HomePage from './components/HomePage';
import ElectricalEquipmentPage from './components/ElectricalEquipmentPage';
import FurniturePage from './components/FurniturePage';
import NotFoundPage from './components/NotFoundPage';
import Navigation from './components/Navigation';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet
} from "react-router-dom";




function App() {


  const routes = [
    {
      path: '/',
      element: (
        <div>
          <h1>KAKUV HELLO WORLD BE</h1>
          <Navigation />
          <hr />
          <Outlet />
        </div>
      ),
    },
    {
      path: '/furniture',
      element: <FurniturePage/>,
    },
    {
      path: '/electrical-equipment',
      element: <div>Electrical Equipment Page</div>,
    },
    {
      path: '*',
      element: <NotFoundPage />,
    },
  ];


  const router = createBrowserRouter(routes);
  

return <RouterProvider router={router} />

}

export default App;
