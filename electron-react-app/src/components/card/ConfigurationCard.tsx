// src/components/card/ConfigurationCard.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import HeadsetPortMolecule from '../molecules/text/HeadsetTrackingPortTextMolecule';
import LeftEyeMolecule from '../molecules/text/LeftEyeImageDataTextMolecule';
import RightEyeMolecule from '../molecules/text/RightEyeImageDataTextMolecule';

const ConfigurationSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="card">
      <div className="">
        <h2 className="text-lg font-semibold">{t('ConfigurationSection.heading')}</h2>
      </div>
      <div className="text-normal text-standard-color">
        <HeadsetPortMolecule />
        <LeftEyeMolecule />
        <RightEyeMolecule />
      </div>
    </div>
  );
};

export default ConfigurationSection;
