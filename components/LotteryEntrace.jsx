import { useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "../constants/index";
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {useNotification } from "web3uikit";

export default function LotteryEntrace() {
    const [entraceFee, setEntraceFee] = useState("0");
    const [recentWinner, setRecentWinner] = useState("");
    const [numberOfPlayers, setNumberOfPlayers] = useState("");
    const  dispatch  = useNotification();
    const { chainId: chainIdHex, isWeb3Enabled, web3 } = useMoralis();
    //convert from hex to int for chainId
    const chainId = parseInt(chainIdHex);

    //get contract address based of chainId. Json file is updated from deployment script in smart contract repo
    const lotteryAddress = chainId in contractAddress ? contractAddress[chainId] : null;

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {}
    });    

    async function updateUI() {
        const entraceFeeFromCall = (await getEntranceFee({
            onError: (error) => { console.log(error) }
        })).toString();
        setEntraceFee(entraceFeeFromCall);

        const recentWinnerCall = (await getRecentWinner({
            onError: (error) => { console.log(error) }
        })).toString();
        setRecentWinner(recentWinnerCall);

        const numberOfPlayersCall = (await getNumberOfPlayers({
            onError: (error) => { console.log(error) }
        })).toString();
        setNumberOfPlayers(numberOfPlayersCall);
    }


    useEffect(() => {
        if(isWeb3Enabled) {
            updateUI()
            //listen to events to update UI automatically. 
            const contract = new ethers.Contract(lotteryAddress, abi, web3);
            contract.on("WinnerPicked", async () => {
                updateUI()
            })
        }
    }, [isWeb3Enabled]);

    const { runContractFunction: enterLottery, isFetching, isLoading } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entraceFee
    });    

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {}
    });    

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {}
    });    

    const handleSuccess = async function (tx) {
        //wait till tx is confirmed. 
        await tx.wait(1);        
        handleNewNotification();
        updateUI();
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
        });
    }


    return (
        <div className="pt-5">
            <div className="">
                {
                    lotteryAddress ? ( 
                        <>
                            <span className="text-2xl"> Entrance Fee : { ethers.utils.formatUnits(entraceFee, "ether")} ETH </span> 
                            <div className="pt-3 pb-3">                                
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" onClick={async () => {
                                    //onSuccess checks if a transcation was successfully sent to metaMask
                                    await enterLottery({
                                        onSuccess: handleSuccess,
                                        onError: (error) => { console.log(error) }
                                    });
                                }} 
                                disabled={isLoading || isFetching}
                                >
                                    {isFetching || isLoading ? (
                                        <div className="animate-spin spinner-borger h-8 w-8 border-b-2 rounded-full"></div>) 
                                        : (<div> Enter Lottery </div>)}                            
                                </button>  

                            </div>
                        </>
                    ) 
                        : ( 
                        <span> Not connected to wallet </span> 
                    )
                }
                {
                    numberOfPlayers ? (
                        <div>Number of players : {numberOfPlayers.toString()} </div>
                    ) : (<></>)
                }
                {
                    recentWinner ? (
                        <div> Last Lottery Winner is : {recentWinner} !!! </div>
                    ) : (<></>)
                }    
            </div>
        </div>
    )
}