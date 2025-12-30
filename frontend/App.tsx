import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Completed from "./pages/Completed";
import Analytics from "./pages/Analytics";
import NewTask from "./pages/NewTask";
import NewAssignment from "./pages/NewAssignment";

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/tasks"
          element={
            <Layout>
              <Tasks />
            </Layout>
          }
        />
        <Route
          path="/schedule"
          element={
            <Layout>
              <Completed />
            </Layout>
          }
        />
        <Route
          path="/analytics"
          element={
            <Layout>
              <Analytics />
            </Layout>
          }
        />
        <Route
          path="/new-task"
          element={
            <Layout>
              <NewTask />
            </Layout>
          }
        />
        <Route
          path="/new-assignment"
          element={
            <Layout>
              <NewAssignment />
            </Layout>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
