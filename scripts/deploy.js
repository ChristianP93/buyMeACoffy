const hre = require("hardhat");

async function main() {
  //Deploy contract;
  const BuyMeACoffeeFactory = await ethers.getContractFactory("BuyMeACoffee");
  const BuyMeACoffeeContract = await BuyMeACoffeeFactory.deploy();
  await BuyMeACoffeeContract.deployed();

  //Contract address;
  const contractAddress = BuyMeACoffeeContract.address;
  console.log(`contract deployed. Address => ${contractAddress}`);


}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
