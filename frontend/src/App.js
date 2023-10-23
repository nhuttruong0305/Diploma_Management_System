import { useRoutes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from "react";

import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import './App.css';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import UserAccountManagement from './components/UserAccountManagement/UserAccountManagement';
import DiplomaType from './components/DiplomaType/DiplomaType';
import DiplomaName from './components/DiplomaName/DiplomaName';
import DecentralizeDiplomaManagement from './components/DecentralizeDiplomaManagement/DecentralizeDiplomaManagement';
import DiplomaNameManagementHistory from './components/DiplomaNameManagementHistory/DiplomaNameManagementHistory';
import ManageUserPermission from './components/ManageUserPermission/ManageUserPermission';
import DiplomaIssuance from './components/DiplomaIssuance/DiplomaIssuance';
import ImportDiploma from './components/ImportDiploma/ImportDiploma';
import DiplomaReview from './components/DiplomaReview/DiplomaReview';
import DiplomaDiary from './components/DiplomaDiary/DiplomaDiary';
import UserAccountInfo from './components/UserAccountInfo/UserAccountInfo';
import ChangePassword from './components/ChangePassword/ChangePassword';
import RequestsForDiplomaDrafts from './components/RequestsForDiplomaDrafts/RequestsForDiplomaDrafts';
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

//Bảo vệ route của UserAccountInfo chỉ cho phép người dùng ngoại trừ admin vào trang này
const ProtectedRouteUserAccountInfo = ({ isAuthenticated, role, children }) => {
  return isAuthenticated && role != 'System administrator' ? children : <Navigate to="/"/>;
}

//Bảo vệ route chỉ cho phép tài khoản có quyền Center Director_Head of Department mới vào dc các trang này
const ProtectedRouteCenterDirectorHeadOfDepartment = ({ isAuthenticated, role, children }) => {
  return isAuthenticated && role == 'Center Director_Head of Department' ? children : <Navigate to="/"/>;
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
      },
      {
        path: '/manage-user-permission',
        element: (
          <ProtectedRouteSystemAdministrator
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <ManageUserPermission/>
          </ProtectedRouteSystemAdministrator>
        )
      },
      {
        path: '/diploma-issuance',
        element: (
          <ProtectedRouteDiplomaImporter
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <DiplomaIssuance/>
          </ProtectedRouteDiplomaImporter>
        )
      },
      {
        path: '/import-diploma',
        element: (
          <ProtectedRouteDiplomaImporter
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <ImportDiploma/>
          </ProtectedRouteDiplomaImporter>
        )
      },
      {
        path: '/review-diploma',
        element: (
          <ProtectedRouteDiplomaReviewer
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <DiplomaReview/>
          </ProtectedRouteDiplomaReviewer>
        )
      },
      {
        path: '/diploma-diary',
        element: (
          <ProtectedRouteSystemAdministrator
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <DiplomaDiary/>
          </ProtectedRouteSystemAdministrator>
        )
      },
      {
        path: '/user-account-info',
        element: (
          <ProtectedRouteUserAccountInfo
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <UserAccountInfo/>
          </ProtectedRouteUserAccountInfo>
        )
      },
      {
        path: '/change-password',
        element: (
          <ProtectedRouteUserAccountInfo
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <ChangePassword/>
          </ProtectedRouteUserAccountInfo>
        )
      },
      {
        path: '/manage_requests_for_diploma_drafts',
        element: (
          <ProtectedRouteCenterDirectorHeadOfDepartment
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <RequestsForDiplomaDrafts/>
          </ProtectedRouteCenterDirectorHeadOfDepartment>
        )
      }
    ])
    return element;
  }

  const [loading, setLoading] = useState(true);
  
  // Mô phỏng thời gian tải trang (có thể thay thế bằng thực tế)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);



  return (
    <div id='div-App'>
        {/* <Routes /> */}
        {loading ? <LoadingSpinner /> : <Routes />}
    </div>
  );
}

export default App;
