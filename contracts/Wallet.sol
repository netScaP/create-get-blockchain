pragma solidity >=0.4.0 <0.6.0;
// This line says the code will compile with version greater than 0.4 and less than 0.6

contract Wallet {
  // constructor to initialize candidates
  // vote for candidates
  // get count of votes for each candidates
  
  bytes32[] public walletsList;
  mapping (bytes32 => uint8) public votesReceived;

  constructor(bytes32[] memory wallets) public {
    // solidity requires that any 
    walletsList = wallets;
  }

  function getWallets() public view returns(bytes32[] memory) {
    return walletsList;
  }
  
  function addWallet(bytes32 wallet) public {
    walletsList.push(wallet);
  }

  function removeWallet(uint index) public {
    delete walletsList[index];
  }
}