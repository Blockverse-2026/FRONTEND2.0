import PanelPlayer from "./PanelPlayer";
import { hasSeenPanel, markPanelSeen } from "../utils/panelProgress";
import { panelsData } from "../utils/panelsData";

const PanelGate = ({ panelKey, children }) => {
  if (hasSeenPanel(panelKey)) {
    return children;
  }

  return (
    <PanelPlayer
      panels={panelsData[panelKey]}
      onComplete={() => {
        markPanelSeen(panelKey);
        window.location.reload();
      }}
    />
  );
};

export default PanelGate;
