import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const lotteryAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className="p-5">
            {lotteryAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Lottery</div>
                        )}
                    </button>
                    <div className="rounded my-4 border-2 border-blue-500/100 w-1/4 bg-sky-500/70">
                        <div className="p-2 font-mono text-white">
                            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")}
                        </div>
                        <div className="p-2 font-mono text-white">
                            Number of Players: {numPlayers}
                        </div>
                        <div className="p-2 font-mono text-white">
                            Recent Winner: <span className="text-white">{recentWinner}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div>No lottery address detected</div>
            )}
        </div>
    )
}
