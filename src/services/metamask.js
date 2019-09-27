function installed() {
  const web3 = window.web3;
  const ethereum = window.ethereum;
  return (
    web3 &&
    web3.currentProvider &&
    web3.currentProvider.isMetaMask === true &&
    (web3.eth || web3.cmt) &&
    ethereum
  );
}

function connect(cb) {
  if (!installed()) {
    cb("notInstalled");
  }
  const web3 = window.web3;
  const ethereum = window.ethereum;
  const ss = web3.eth || web3.cmt;
  ss.getAccounts((err, accounts) => {
    if (err !== null) {
      cb("notAuthorized");
    } else {
      if (accounts === null || accounts.length === 0) {
        ethereum
          .enable()
          .then(accounts => {
            if (accounts === null || accounts.length === 0) {
              cb("notAuthorized");
            } else {
              cb("authorized");
            }
          })
          .catch(() => {
            cb("notAuthorized");
          });
      } else {
        cb("authorized");
      }
    }
  });
}

export { installed, connect };
