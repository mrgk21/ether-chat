type itemType = { label: string; name: string; onClick: (_event: React.MouseEvent<HTMLElement>) => void };

interface SidebarProps {
	groups: Array<itemType> | null;
	chats: Array<itemType> | null;
}

const Sidebar = ({ groups, chats }: SidebarProps) => {
	return (
		<aside className="dark:bg-gray-900 sticky top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
			<div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-900">
				<ul className="space-y-2">
					<ul>
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
					<ul>
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
					<li className="p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
						Pro
					</li>
					<li className="p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
						Inbox
					</li>
					<li className="p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
						Users
					</li>
					<li className="p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
						Products
					</li>
					<li className="p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
						Sign In
					</li>
					<li className="p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
						Sign Up
					</li>
				</ul>
			</div>
		</aside>
	);
};

export default Sidebar;
