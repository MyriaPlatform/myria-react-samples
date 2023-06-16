import { useState } from "react";

type Props = {
  label: string;
  toggled: boolean;
  onClick: (value: boolean) => void;
};

const SwitchToogle = ({ label, toggled, onClick }: Props) => {
  const [isToggled, toggle] = useState(toggled);

  const handleClick = () => {
    toggle(!isToggled);
    onClick(!isToggled);
  };

  return (
    <label className="toogleSwitchSelect">
      <strong>{label}</strong>
      <input type="checkbox" defaultChecked={isToggled} onClick={handleClick} />
      <span />
    </label>
  );
};
export default SwitchToogle;
