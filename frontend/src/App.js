import { useRoutes } from 'react-router-dom';

import './App.css';
import HomePage from './components/HomePage/HomePage';
import HomePageSystemAdminstrator from './components/HomePageSystemAdministrator/HomePageSystemAdminstrator';
import Login from './components/Login/Login';
import UserAccountManagement from './components/UserAccountManagement/UserAccountManagement';


function App() {
  function Routes(){
    const element = useRoutes([
      { path: "/", element: <HomePage/> },
      { path: '/login', element: <Login/>},
      { path: '/user-account-management', element: <UserAccountManagement/>},
    ])
    return element;
  }

  return (
    <div id='div-App'>
        <Routes />
    </div>
  );
}

export default App;
