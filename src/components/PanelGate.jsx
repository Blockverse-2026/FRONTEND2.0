import PanelPlayer from "./PanelPlayer";
import { hasSeenPanel, markPanelSeen } from "../utils/panelProgress";
import { PANELS_DATA } from "../utils/panelsData";

const PanelGate = ({ panelKey, children }) => {
  if (hasSeenPanel(panelKey)) {
    return children;
  }

  return (
    <PanelPlayer
      panels={PANELS_DATA[panelKey]}
      onComplete={() => {
        markPanelSeen(panelKey);
      }}
    />
  );
};

export default PanelGate;
