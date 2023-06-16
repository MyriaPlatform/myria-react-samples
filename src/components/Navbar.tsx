import { Link } from "react-router-dom";

type Props = {
  items: any;
  title: string;
  buttonTitle: string;
  onButtonClick: any;
  isConnectedWallet: boolean;
};

const Navbar = ({
  title,
  items,
  onButtonClick,
  buttonTitle,
  isConnectedWallet,
}: Props) => {
  return (
    <>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            {title}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {items.map((item: any) => (
                <li className="nav-item" key={item.title}>
                  <Link className="nav-link text-white" to={item.url}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              className="btn-mry"
              onClick={onButtonClick}
              disabled={isConnectedWallet}
            >
              {buttonTitle}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
