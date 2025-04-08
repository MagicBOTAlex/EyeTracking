// src/components/misc/Tabs.tsx

/**
 * Tabs Component
 *
 * This component renders a tabbed interface using daisyUI's tabs and Tailwind CSS.
 * The active tab index is managed via Redux, allowing for centralized state management
 * across the application. A settings button is included to open a settings dialog.
 *
 * Props:
 * @param {Tab[]} tabs - An array of tab objects, each containing a label and content.
 */

import React, { useState, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import { setActiveTabIndex } from "../../slices/configSlice";
import SettingsDialogWithContent from "./SettingsDialogWithContent";

import StatusPage from "../page/StatusPage";
import DatabasePage from "../page/DatabasePage";
import TrackingPage from "../page/TrackingPage";

// Shameless promotion
import DeprivedLogo from '@images/DeprivedLogo.svg?react';

const Tabs: React.FC = ({  }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Retrieve the active tab index from the Redux store.
  const activeTabIndex = useSelector((state: RootState) => state.config.activeTabIndex);

  // Local state to control the visibility of the settings dialog.
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const tabs = [
    {
      label: t("App.tabStatus"),
      content: <StatusPage />
    },
    {
      label: t("App.tabDatabase"),
      content: <DatabasePage />
    },
    {
      label: t("App.tabTracking"),
      content: <TrackingPage />
    }
  ];

  // Update the active tab index in the Redux store when a tab is clicked.
  const handleTabClick = (index: number): void => {
    dispatch(setActiveTabIndex(index));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navbar (Scuffed, but this codebase is already quite messy)*/}
      <div className="flex bg-base-200">
        <div className="bg-grid-300 border border-base-300">
          <div className="w-16 h-16 p-1 fill-base-100 object-contain">
            <DeprivedLogo/>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex flex-col justify-end">
          <div role="tablist" className="tabs tabs-border tabs-lg">
            {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => handleTabClick(index)}
                  className={`tab ${activeTabIndex === index ? "tab-active" : ""}`}
                >
                  {tab.label}
                </button>
              ))}
          </div>
        </div>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="text-superbig text-header-color text-bold"
          style={{
            marginLeft: "auto",
            width: "70px",
            flex: "none",
            padding: "0px"
          }}
        >
          {t("Tabs.settings")}
        </button>
      </div>

      

      {/* Tab Content */}
      <div className="p-4">
        {tabs[activeTabIndex]?.content}
      </div>

      {/* Settings Dialog */}
      <SettingsDialogWithContent
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Tabs;
