import { useRoutes } from 'react-router-dom';

import './App.css';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import UserAccountManagement from './components/UserAccountManagement/UserAccountManagement';
import DiplomaType from './components/DiplomaType/DiplomaType';
import DiplomaName from './components/DiplomaName/DiplomaName';

function App() {
  function Routes(){
    const element = useRoutes([
      { path: "/", element: <HomePage/> },
      { path: '/login', element: <Login/>},
      { path: '/user-account-management', element: <UserAccountManagement/>},
      { path: '/diploma-type', element: <DiplomaType/>},
      { path: '/diploma-name', element: <DiplomaName/>}
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
