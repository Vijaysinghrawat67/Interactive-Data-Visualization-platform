import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

// Layout Components
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "./services/ProtectedRoute";

// Pages
const LandingPage = React.lazy(() => import("@/pages/LandingPage.jsx"));
const FeaturesPage = React.lazy(() => import("@/pages/FeaturesPage.jsx"));
const LoginPage = React.lazy(() => import("@/pages/Login.jsx"));
const RegisterPage = React.lazy(() => import("@/pages/Register.jsx"));
const ContactPage = React.lazy( () => import("@/pages/Contact.jsx"))

// Dashboard Layout and children
const DashboardPage = React.lazy(() => import("@/pages/dashboard/index.jsx"));
const DashboardOverview = React.lazy(() => import("@/pages/dashboard/DashboardOverview.jsx"));
const Profile = React.lazy(() => import("@/pages/dashboard/Profile.jsx"));

const VisualizationList = React.lazy(() => import("@/pages/dashboard/visualization/VisualizationListPage.jsx"));
const CreateVisualization = React.lazy( () => import("@/pages/dashboard/visualization/CreateVisualization.jsx"));
const EditVisualization = React.lazy(() => import("@/pages/dashboard/visualization/EditVisualization.jsx"));
const ViewVisualizationPage = React.lazy( () => import("@/pages/dashboard/visualization/ViewVisualizationPage.jsx"));

const DataSourceList = React.lazy(() => import("@/pages/dashboard/datasource/DataSourceList.jsx"))
const UplloadDataSource = React.lazy( () => import("@/pages/dashboard/datasource/UploadDataSource.jsx"))
const GetSingleDataSource = React.lazy( () => import("@/pages/dashboard/datasource/ViewDataSource.jsx"))

const ActivityLogs = React.lazy(() => import("@/pages/dashboard/Logs.jsx"));
const SettingPage = React.lazy(() => import("@/pages/dashboard/Setting.jsx"));
//const Dashboard = React.lazy( () => import("@/pages/dashboard/dash/Dashboard.jsx"))
const ExportPage = React.lazy( () => import("@/pages/dashboard/export/ExportPage.jsx"))
const ViewExportPage = React.lazy( () => import("@/pages/dashboard/export/ViewExportPage.jsx"))

function App() {
  return (
    <Router>
      <Toaster richColors position="top-center" />
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route  path="features" element={< FeaturesPage />}/>
            <Route  path="contact" element={< ContactPage/>}/> 
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route index element={<DashboardOverview />} />
              <Route path="overview" element={<DashboardOverview />} />
              <Route path="profile" element={<Profile />} />

              {/* visualization */}
              <Route path="visualization">
                  <Route index element={<VisualizationList/>}/>
                  <Route path="create" element={<CreateVisualization />} />
                  <Route path="edit/:id" element={<EditVisualization/>} />
                  <Route path=":id" element={< ViewVisualizationPage/>}/>  
              </Route>

              {/* datasources */}
              <Route path="datasource">
                <Route index element={< DataSourceList/>} />
                <Route  path="upload" element={< UplloadDataSource/>}/>
                <Route  path="view/:id" element={< GetSingleDataSource/>}/>
              </Route>
              
              <Route path="settings" element={<SettingPage />} />
              <Route path="export" >
                  <Route index element={<ExportPage />} />
                  <Route path="view" element={<ViewExportPage />} />
              </Route>
              
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
