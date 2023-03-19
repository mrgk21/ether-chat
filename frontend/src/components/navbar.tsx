import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

type itemType = { label: string; name: string; onClick: (_event: React.MouseEvent<HTMLElement>) => void };

interface SidebarProps {
	groups: Array<itemType> | null;
	chats: Array<itemType> | null;
}

const Navbar = ({ groups, chats }: SidebarProps) => {
	const { signMessageAsync } = useSignMessage({
		onError: (error) => console.log("error:", error.message),
	});
	const { address, isConnected } = useAccount({
		onConnect: ({ address, isReconnected }) => console.log(address, isReconnected),
		onDisconnect: () => console.log("disconnected"),
	});
	const { connectAsync } = useConnect({ connector: new InjectedConnector({}) });
	const { disconnectAsync } = useDisconnect();

	// handles wallet connection during CSR
	const [_isConnected, _setIsConnected] = useState(false);
	useEffect(() => {
		_setIsConnected(isConnected);
	}, [isConnected]);

	const onboard = async () => {
		try {
			const { account } = await connectAsync();
			const sign = await signMessageAsync({ message: `abcd: ${account}` });
			console.log(sign);
		} catch (error: any) {
			console.log(error.message);
		}
	};

	return (
		<nav className="bg-white px-2 sm:px-4 py-2.5 dark:bg-gray-900 sticky w-full z-10 top-0">
			<div className="flex flex-wrap items-center mx-auto ">
				<div className="flex ml-auto items-center">
					<ul className="p-2">
						<h1 className="text-xl text-white">Groups</h1>
						{groups &&
							groups.map((group) => (
								<li className="hover:cursor-pointer p-2 pl-4 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
									<button type="button" name={group.name} onClick={(e) => group.onClick(e)}>
										{group.label}
									</button>
								</li>
							))}
					</ul>
					<ul className="p-2">
						<h1 className="text-xl text-white">Chats</h1>
						{chats &&
							chats.map((chat) => (
								<li className="hover:cursor-pointer p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
									<button type="button" name={chat.name} onClick={(e) => chat.onClick(e)}>
										{chat.label}
									</button>
								</li>
							))}
					</ul>
					{!_isConnected ? (
						<button
							type="button"
							className="text-white w-fit truncate bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={onboard}
						>
							Connect Wallet
						</button>
					) : (
						<div className="flex items-center">
							<button
								type="button"
								className="text-white w-fit truncate bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
								onClick={() => disconnectAsync()}
							>
								Disconnect
							</button>
							<p className="text-white font-mono ml-2 w-[8rem] truncate">{address}</p>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
