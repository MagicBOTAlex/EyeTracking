// src/components/card/LeftEyeCameraCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import CameraStream from '../molecules/CameraStreamMolecule';

const LeftEyeCameraCard: React.FC = () => {
  const { t } = useTranslation();

  return (
        <CameraStream streamField="leftEye" />
  );
};

export default LeftEyeCameraCard;
