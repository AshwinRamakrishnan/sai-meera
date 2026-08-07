import React from 'react';
import { motion } from 'framer-motion';
import './MachineHUD.css';
import SpecBadges from './SpecBadges.jsx';
import MeterBar from './MeterBar.jsx';
import MachineConsole from './MachineConsole.jsx';

export default function MachineHUD({
  machineNumber,
  machineName,
  serialNumber,
  specs,
  accentColor,
  scrollRatio,
  consoleLines = []
}) {
  let statusText = "STANDBY";
  let statusClass = "statusStandby";
  
  if (scrollRatio > 0.8) {
    statusText = "COMPLETE";
    statusClass = "statusComplete";
  } else if (scrollRatio > 0.2) {
    statusText = "OPERATING";
    statusClass = "statusOperating";
  }

  return (
    <motion.div 
      className="hudPanel"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ '--border-color': accentColor }}
    >
      <div className="hudHeader">
        <div className="machineId">
          <span className="number">{machineNumber}</span>
          <span className="serial">{serialNumber}</span>
        </div>
        <h2 className="machineName">{machineName}</h2>
      </div>

      <div className="statusSection">
        <div className="statusLabel">SYS.STATUS</div>
        <div className={`statusIndicator ${statusClass}`}>
          <div className="statusDot" />
          {statusText}
        </div>
      </div>

      <SpecBadges specs={specs} accentColor={accentColor} />

      <div className="meterSection">
        <MeterBar 
          progress={scrollRatio} 
          accentColor={accentColor} 
          label="JOB PROGRESS" 
        />
      </div>

      <MachineConsole 
        lines={consoleLines} 
        scrollRatio={scrollRatio} 
        accentColor={accentColor} 
      />
    </motion.div>
  );
}
