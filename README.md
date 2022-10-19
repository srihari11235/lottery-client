## Lottry UI 

This is a UI application build with Nextjs for interacting with [lottery smart contract](https://github.com/srihari11235/lottery-contract). A user can enter the lottery by clicking on 'Enter Lottery' button. This promotes a connection to the browser wallet account. On confirmation of the transaction for the 'entrance fee', the account of the user will be added to the lot. The total number of players who have entered the lottery can be seen in next to 'Number of players'.

The winner for the lottery is selected at random predefined intervals. Once the winner is selected, the UI is automatically updated with the winner's public account address, displayed next to 'Last Lottery Winner is:'.  

### Local Set Up 

#### Running UI

1. Run command 'npm install' to install all packages.
2. Run command 'npm run dev' to start local server and view UI.

#### Deploying smart contract 

1. Clone [repo](https://github.com/srihari11235/lottery-contract)
2. Run command 'npm install' to install all packages.
3. Run command 'npx hardhat node' to start a local hardhat node.
4. Run command 'npx hardhat deploy --network localhost' to deploy smart contract to local node.

#### Triggering winner selection

1. Clone [repo](https://github.com/srihari11235/lottery-contract) if not cloned before. 
2. Run command 'npx hardhat run scripts/mockOffChain.ts --network localhost' to run mockOffChain.ts script. This script invokes the random winner selection and updates the lottert smart contract accordingly. 
