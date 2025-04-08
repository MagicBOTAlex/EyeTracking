// src/components/card/RightEyeCameraCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import CameraStream from '../molecules/CameraStreamMolecule';

const RightEyeCameraCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <CameraStream streamField="rightEye" />
  );
};

export default RightEyeCameraCard;
