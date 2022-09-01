import '../assets/styles.css';

type Props = {
  isConnected: boolean,
  checkIfMetaMaskConnected: any
  account: string,
}

function MetamaskView({ isConnected, checkIfMetaMaskConnected, account }: Props) {
  
return (
    <div>
      <div>
        <h3>Action</h3>
        <div
          onClick={checkIfMetaMaskConnected}
        >
          ➔ Connect MetaMask
        </div>
      </div>
      <div>
        <h3>Output</h3>
        <h4>MetaMask</h4>
        <code className="language-bash">
          <div className="margin-bottom--sm">
            Status: {isConnected ? "connected" : "not connected"}
          </div>
          <div className="margin-bottom--sm">Account: {account}</div>
        </code>
      </div>
    </div>
  );
}

export default MetamaskView;
