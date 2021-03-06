import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="border-b-2 flex flex-row">
            <div className="text-5xl font-extrabold ...">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-500">
                    Decentralized Lottery
                </span>
            </div>
            <div className="ml-auto py-2 px-4">
                <ConnectButton />
            </div>
        </div>
    )
}
