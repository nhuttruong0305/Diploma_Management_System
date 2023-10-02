import { useRoutes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './App.css';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import UserAccountManagement from './components/UserAccountManagement/UserAccountManagement';
import DiplomaType from './components/DiplomaType/DiplomaType';
import DiplomaName from './components/DiplomaName/DiplomaName';
import DecentralizeDiplomaManagement from './components/DecentralizeDiplomaManagement/DecentralizeDiplomaManagement';
import DiplomaNameManagementHistory from './components/DiplomaNameManagementHistory/DiplomaNameManagementHistory';

//Bảo vệ route của System administrator
const ProtectedRouteSystemAdministrator = ({ isAuthenticated, role, children }) => {
  return isAuthenticated && role == 'System administrator' ? children : <Navigate to="/"/>;
};

//Bảo vệ route của Diploma importer
const ProtectedRouteDiplomaImporter = ({ isAuthenticated, role, children }) => {
  return isAuthenticated && role == 'Diploma importer' ? children : <Navigate to="/"/>;
}

//Bảo vệ route của Diploma reviewer
const ProtectedRouteDiplomaReviewer = ({ isAuthenticated, role, children }) => {
  return isAuthenticated && role == 'Diploma reviewer' ? children : <Navigate to="/"/>;
}


function App() {
  //Lấy thông tin user 
  const user = useSelector((state) => state.auth.login?.currentUser);

  function Routes(){
    const element = useRoutes([
      { path: "/", element: <HomePage/> },
      { path: '/login', element: <Login/>},
      { 
        path: '/user-account-management', 
        element: (
          <ProtectedRouteSystemAdministrator
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <UserAccountManagement/>
          </ProtectedRouteSystemAdministrator>
        )
      },
      { 
        path: '/diploma-type', 
        element: (
          <ProtectedRouteSystemAdministrator
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <DiplomaType/>
          </ProtectedRouteSystemAdministrator>
        )
      },
      { 
        path: '/diploma-name', 
        element: (
          <ProtectedRouteSystemAdministrator
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <DiplomaName/>
          </ProtectedRouteSystemAdministrator>
        )
      },
      {
        path: '/decentralize-diploma-management',
        element: (
          <ProtectedRouteSystemAdministrator
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <DecentralizeDiplomaManagement/>
          </ProtectedRouteSystemAdministrator>
        )
      },
      {
        path: '/diploma-name-management-history',
        element: (
          <ProtectedRouteSystemAdministrator
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <DiplomaNameManagementHistory/>
          </ProtectedRouteSystemAdministrator>
        )
      }
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
