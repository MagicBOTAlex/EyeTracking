// src/components/atoms/StatusIndicator.tsx

/**
 * StatusIndicator Component
 *
 * This component renders a status indicator that visually displays a status
 * using a colored dot, a label, and a status description. It is designed as an atomic
 * UI element for inclusion in larger components or pages.
 *
 * The component accepts the following properties:
 * - label: The text label representing the item or context.
 * - status: The status value which can be 'good', 'bad', or 'forced'. This value
 *           determines the color of the indicator dot.
 * - statusText: The descriptive text corresponding to the status (e.g., "Online",
 *               "Offline", "Forced Offline").
 * - tooltip: An optional tooltip text that appears when hovering over the component.
 *
 * The dot color is determined by the status:
 * - For 'good', it uses the CSS variable "--color-status-dot-good".
 * - For 'bad' or 'forced', it uses the CSS variable "--color-status-dot-bad".
 */

import React from 'react';
import { Dot } from 'lucide-react';

export type StatusType = 'good' | 'bad' | 'forced';

export interface StatusIndicatorProps {
  /** The label (e.g. the card title or name). */
  label: string;
  /** The status (good, bad, or forced). */
  status: StatusType;
  /** The text to show for the status (e.g. "Online", "Offline", "Forced Offline"). */
  statusText: string;
  /** Optional tooltip text (e.g. helpful info on hover). */
  tooltip?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  label,
  status,
  statusText,
  tooltip,
}) => {

  return (
    <div className='p-2'>
      <div className={`flex border-l-2 pl-2 ${status === 'good' ? "border-success" : "border-error"}`} title={tooltip}>
        <div className="flex flex-col">
          <span className="text-header text-bold">{label}</span>
          <span className="text-header">{statusText}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
