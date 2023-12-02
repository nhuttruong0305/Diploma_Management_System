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
import ApproveRequestForIssuanceOfEmbryos from './components/ApproveRequestForIssuanceOfEmbryos/ApproveRequestForIssuanceOfEmbryos';
import ManageRequestsForEmbryoIssuanceForSecretary from './components/ManageRequestsForEmbryoIssuanceForSecretary/ManageRequestsForEmbryoIssuanceForSecretary';
import Statistical from './components/Statistical/Statistical';
import ManageRequestsForEmbryoIssuanceForStocker from './components/ManageRequestsForEmbryoIssuanceForStocker/ManageRequestsForEmbryoIssuanceForStocker';
import RequestForIssuanceOfEmbryosProcessed from './components/RequestForIssuanceOfEmbryosProcessed/RequestForIssuanceOfEmbryosProcessed';
import UnitPriceManagement from './components/UnitPriceManagement/UnitPriceManagement';
import ManagementOfDamagedEmbryos from './components/ManagementOfDamagedEmbryos/ManagementOfDamagedEmbryos';
import CreateRequestReissue from './components/CreateRequestReissue/CreateRequestReissue';
import ApproveRequestReissue from './components/ApproveRequestReissue/ApproveRequestReissue';
import RequestReissueForSecretary from './components/RequestReissueForSecretary/RequestReissueForSecretary';
import RequestReissueForStocker from './components/RequestReissueForStocker/RequestReissueForStocker';
import RequestReissueProcessed from './components/RequestReissueProcessed/RequestReissueProcessed';
import ManagementUnitSecretary from './components/ManagementUnitSecretary/ManagementUnitSecretary';
import ManagementUnitSecretaryRequestReissue from './components/ManagementUnitSecretary/ManagementUnitSecretaryRequestReissue';
import DiplomaStatistics from './components/DiplomaStatistics/DiplomaStatistics';
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

//Bảo vệ route chỉ cho phép tài khoản có quyền Leader mới vào được trang này
const ProtectedRouteLeader = ({ isAuthenticated, role, children }) => {
  return isAuthenticated && role == 'Leader' ? children : <Navigate to="/"/>;
}

//Bảo vệ route chỉ cho phép tài khoản có quyền Secretary mới vào được trang này
const ProtectedSecretary = ({ isAuthenticated, role, children }) => {
  return isAuthenticated && role == 'Secretary' ? children : <Navigate to="/"/>;
}

//Bảo vệ route chỉ cho phép tài khoản có quyền Stocker mới vào được trang này
const ProtectedStocker = ({ isAuthenticated, role, children }) => {
  return isAuthenticated && role == 'Stocker' ? children : <Navigate to="/"/>;
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
          <ProtectedRouteCenterDirectorHeadOfDepartment
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <DiplomaDiary/>
          </ProtectedRouteCenterDirectorHeadOfDepartment>
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
      },
      {
        path: '/approve_request_for_issuance_of_embryos',
        element: (
          <ProtectedRouteLeader
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <ApproveRequestForIssuanceOfEmbryos/>
          </ProtectedRouteLeader>
        )
      },
      {
        path: '/manage_requests_for_embryo_issuance_for_secretary',
        element: (
          <ProtectedSecretary
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <ManageRequestsForEmbryoIssuanceForSecretary/>
          </ProtectedSecretary>
        )
      },
      {
        path: '/statistical',
        element: 
            <Statistical/>
      },
      {
        path: '/manage_requests_for_embryo_issuance_for_stocker',
        element: (
          <ProtectedStocker
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <ManageRequestsForEmbryoIssuanceForStocker/>
          </ProtectedStocker>
        )
      },
      {
        path: '/request_for_issuance_of_embryos_processed',
        element: (
          <ProtectedSecretary
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <RequestForIssuanceOfEmbryosProcessed/>
          </ProtectedSecretary>
        )
      },
      {
        path: '/unit_price_management',
        element: (
          <ProtectedStocker
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <UnitPriceManagement/>
          </ProtectedStocker>
        )
      },
      {
        path: '/management_of_damaged_embryos',
        element: (
          <ProtectedStocker
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <ManagementOfDamagedEmbryos/>
          </ProtectedStocker>
        )
      },
      {
        path: '/create_request_reissue',
        element: (
          <ProtectedRouteCenterDirectorHeadOfDepartment
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <CreateRequestReissue/>
          </ProtectedRouteCenterDirectorHeadOfDepartment>
        )
      },
      {
        path: '/approve_request_for_reissue',
        element: (
          <ProtectedRouteLeader
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <ApproveRequestReissue/>
          </ProtectedRouteLeader>
        )
      },
      {
        path: '/request_reissue_for_secretary',
        element: (
          <ProtectedSecretary
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <RequestReissueForSecretary/>
          </ProtectedSecretary>
        )
      },
      {
        path: '/request_reissue_for_stocker',
        element: (
          <ProtectedStocker
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <RequestReissueForStocker/>
          </ProtectedStocker>
        )
      },
      {
        path: '/request_reissue_processed',
        element: (
          <ProtectedSecretary
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <RequestReissueProcessed/>
          </ProtectedSecretary>
        )
      },
      {
        path: '/management_unit_secretary',
        element: (
          <ProtectedSecretary
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <ManagementUnitSecretary/>
          </ProtectedSecretary>
        )
      },
      {
        path: '/management_unit_secretary_request_reissue',
        element: (
          <ProtectedSecretary
            isAuthenticated = {!user ? false : true}
            role = {user?.role[0]}
          >
            <ManagementUnitSecretaryRequestReissue/>
          </ProtectedSecretary>
        )
      },
      {
        path: '/diploma_statistics',
        element:
          <DiplomaStatistics/>
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
