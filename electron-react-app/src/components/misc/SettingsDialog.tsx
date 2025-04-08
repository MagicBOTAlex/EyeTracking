// src/components/misc/SettingsDialog.tsx

/**
 * The Settings Dialog and SettingsDialogWithContent together form the settings modal
 * dialog of the application. Inside there you can control the theme and language.
 *
 * This component in particular handles the control flow of the dialog.
 * The other component is responsible for the actual content.
 */
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose, children }) => {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal modal-open">
      <div ref={dialogRef} className="modal-box">
        {children || <p>{t('SettingsDialog.settings')}</p>}
      </div>
    </div>,
    document.body
  );
};

export default SettingsDialog;
