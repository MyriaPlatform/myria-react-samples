import { useState } from "react";
import { NetworkID } from "../helpers/useMetamask";
import { toast } from "react-toastify";

type Props = {
  label: string;
  toggled: boolean;
  isConnected: boolean;
  setNetWorkIdByUser: React.Dispatch<React.SetStateAction<NetworkID>>;
};

const SwitchToogleNetWork = ({
  label,
  toggled,
  setNetWorkIdByUser,
  isConnected
}: Props) => {
  const [isToggled, toggle] = useState(toggled);

  const handleClick = () => {
      if (isToggled === true) {
        setNetWorkIdByUser(NetworkID.SEPOLIA);
      } else {
        setNetWorkIdByUser(NetworkID.MAINNET);
      }
      toggle(!isToggled);
  };

  return (
    <label onClick={()=> {
      if(isConnected) {
        toast.warning("Can't change network when connected!")
        return
      }
    }} className="toogleSwitchSelect">
      <strong>{label}</strong>
      <input type="checkbox" defaultChecked={isToggled} disabled={isConnected} onClick={handleClick} />
      <span />
    </label>
  );
};
export default SwitchToogleNetWork;
