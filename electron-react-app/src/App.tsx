// src/App.tsx

/**
 * Main Application Component
 *
 * This component serves as the root of the application and sets up a tabbed user interface
 * for navigation between various pages.
 */
import React from "react";
import MainLayout from "./components/misc/MainLayout";
import "./i18n";

const App: React.FC = () => {

  return (
    <div className="text-font-normal application-background-color">
      {/* We don't have to over complicate this */}
      <MainLayout/>
    </div>
  );
};

export default App;
