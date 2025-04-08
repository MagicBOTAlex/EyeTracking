// src/components/page/StatusPage.tsx

/**
 * The status page contains cards for configuring and validating
 * the connection between the client and the physical hardware.
 * 
 * It allows you to set ports and ips, as well as view camera
 * feeds and the feed from the VRTA application if running.
 */

import React from "react";
import LeftEyeStatusCard from "../card/LeftEyeStatusCard";
import RightEyeStatusCard from "../card/RightEyeStatusCard";
import ThetaStatusCard from "../card/VRHeadsetTrackingCard";
import ConfigurationSection from "../card/ConfigurationCard";
import HeadsetTrackingCard from "../card/HeadsetTrackingCard";
import LeftEyeCameraCard from "../card/LeftEyeCameraCard";
import RightEyeCameraCard from "../card/RightEyeCameraCard";

enum CardType {
  Left = 'left',
  Right = 'right',
  Headset = 'headset',
}

const CardComponents: Record<CardType, [React.FC, React.FC]> = {
  [CardType.Left]: [LeftEyeStatusCard, LeftEyeCameraCard],
  [CardType.Right]: [RightEyeStatusCard, RightEyeCameraCard],
  [CardType.Headset]: [ThetaStatusCard, HeadsetTrackingCard],
};

const StatusPage: React.FC = () => {



  return (
    <div className="flex flex-col flex-1">

      {/* Sorry bro, but I an't touching alla dat react. ew. svelte is sooo much more pleasent to read */}
      <div className="w-full flex justify-center p-8 ">
        <div className="rounded-t-lg flex gap-2">

          {Object.values(CardType).map((key) => {
            const [Status, Camera] = CardComponents[key];
            return <div>
              {/* React is sooo cursed wtf */}
              <div className="relative grid place-items-center w-full rounded-t-lg border-2 border-b-0 border-base-200">
                <div className="relative w-48 h-48 rounded-t-lg bg-grid-100">
                </div>
                <div className="absolute flex justify-center items-center top-0 bottom-0 object-fit overflow-hidden rounded-lg">
                  <Camera />
                </div>
              </div>
              <div className="bg-base-200 rounded-b-lg">
                {/* Again, I could make it prettier, but nah. React is soo unreadable compared to Svelte */}
                <Status />
              </div>
            </div>;
          })}
        </div>
      </div>

      <div className="bg-base-200 flex-1 p-4">
        <ConfigurationSection />
      </div>
    </div>
  );
};

export default StatusPage;
