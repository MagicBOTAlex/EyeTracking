// src/components/misc/SettingsDialogWithContent.tsx

/**
 * This component allows the user to select a theme and language for the client.
 */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SettingsDialog from './SettingsDialog';
import { RootState } from '../../store';
import { setLanguage, setTheme } from '../../slices/configSlice';
import BackgroundImageUrlTextMolecule from '../molecules/text/BackgroundImageUrlTextMolecule';

interface SettingsDialogWithContentProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsDialogWithContent: React.FC<SettingsDialogWithContentProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((state: RootState) => state.config.language);
  const currentTheme = useSelector((state: RootState) => state.config.theme);

  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(e.target.value));
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setTheme(e.target.value));
  };

  return (
    <SettingsDialog isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold">{t('SettingsDialogWithContent.settings')}</h2>
          <p className="text-base">{t('SettingsDialogWithContent.configureSettings')}</p>
        </div>

        {/* Language Selection */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <label htmlFor="language-select" className="label">
              <span className="label-text">{t('SettingsDialogWithContent.languageLabel')}</span>
            </label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="select select-bordered w-full"
            >
              <option value="English">{t('SettingsDialogWithContent.optionEnglish')}</option>
              <option value="Japanese">{t('SettingsDialogWithContent.optionJapanese')}</option>
              <option value="German">{t('SettingsDialogWithContent.optionGerman')}</option>
              <option value="French">{t('SettingsDialogWithContent.optionFrench')}</option>
              <option value="Spanish">{t('SettingsDialogWithContent.optionSpanish')}</option>
            </select>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <label htmlFor="theme-select" className="label">
              <span className="label-text">{t('SettingsDialogWithContent.themeLabel')}</span>
            </label>
            <select
              id="theme-select"
              value={currentTheme}
              onChange={handleThemeChange}
              className="select select-bordered w-full"
            >
              <option value="green">green</option>
              <option value="netherrack">netherrack</option>
              <option value="dark">dark</option>
              <option value="pink">pink</option>
            </select>
            <div className="mt-4">
              <BackgroundImageUrlTextMolecule />
            </div>
          </div>
        </div>
      </div>
    </SettingsDialog>
  );
};

export default SettingsDialogWithContent;
