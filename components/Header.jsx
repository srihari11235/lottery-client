import { ConnectButton} from "web3uikit"

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="font-bold text-3xl">
                Decentralised Lottery
            </h1>
            <div className="ml-auto">
                <ConnectButton moralisAuth={false}/>
            </div>
            
        </div>
    )
}