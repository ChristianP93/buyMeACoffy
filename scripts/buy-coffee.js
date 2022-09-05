const hre = require("hardhat");
const ethers = hre.ethers;

/**
* @dev get balance of a given address;
* @param address address;
*/
const _getBalance = async (address) => {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
};

/**
* @dev print balance of a given addresses;
* @param addresses list of address;
*/
const _printBalances = async (wallets) => {
  let index = 0;
  for(const wallet of wallets){
     console.log(`${wallet.owner} balance: `, await _getBalance(wallet.address));
    index ++;
  };
};

/**
* @dev log the memos stored on-chain;
* @param memos list of memo {timestamp, from, name, message};
*/
const _printMemos = async (memos) => {
  for(const memo of memos){ console.log(`At ${memo.timestamp}, ${memo.name} (with address: ${memo.from}) said: ${memo.message}`) };
};

async function main() {

  //Get example accounts;
  const [owner, tipper1, tipper2, tipper3] = await ethers.getSigners();

  //Deploy contract;
  const BuyMeACoffeeFactory = await ethers.getContractFactory("BuyMeACoffee");
  const BuyMeACoffeeContract = await BuyMeACoffeeFactory.deploy();
  await BuyMeACoffeeContract.deployed();

  //Contract address;
  const contractAddress = BuyMeACoffeeContract.address;
  console.log(`contract deployed. Address => ${contractAddress}`);


  //Get the contract's balance before coffee purchase;
  const wallets = [{owner: "owner", address: owner.address}, {owner: "tipper1", address: tipper1.address}, {owner: "tipper2", address: tipper2.address}, {owner: "tipper3", address: tipper3.address}, {owner: "contractAddress", address: contractAddress}];
  console.log('---START---');
  await _printBalances(wallets);


  //define tip amount;
  const tip = {value: ethers.utils.parseEther("1")};

  //call buyCoffee function with tipper1 tipper2 tipper3 addresses
  await BuyMeACoffeeContract.connect(tipper1).buyCoffee('tipper1', "message1", tip);
  await BuyMeACoffeeContract.connect(tipper2).buyCoffee('tipper2', "message2", tip);
  await BuyMeACoffeeContract.connect(tipper3).buyCoffee('tipper3', "message3", tip);

  //Get the contract's balance after coffee purchase;
  console.log('---AFTER BOUGHT COFFEES---');
  await _printBalances(wallets);

  //Withdraw tips as tipper, must generate an error;
  // await BuyMeACoffeeContract.connect(tipper1).withdrawTips();

  //Withdraw tips as owner, must works;
  await BuyMeACoffeeContract.connect(owner).withdrawTips();

  //Get the contract's balance withdraw tips;
  console.log('---AFTER WITHDRAW TIPS---');
  await _printBalances(wallets);


  //Get memos
  const memos = await BuyMeACoffeeContract.getMemos();
  console.log('Memos: ', memos);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
