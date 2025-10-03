import { FlexRowAlignCenter } from "./Flex/index.tsx";
import { WithOptionsMenu } from "./WithOptionsMenu.tsx";
import { StorageService } from "../utils/chromeStorage.ts";

const MainTitle = () => {
	return (
		<WithOptionsMenu
			options={[
				{
					label: "Export Boards",
					onClick: () => StorageService.exportBoards(),
				},
			]}
		>
			{({ openMenu }) => (
				<h1
					onClick={openMenu}
					style={{
						color: "#5F6061",
						fontFamily: "Rumiko Sans",
						fontSize: "2.4rem",
						fontWeight: "600",
					}}
				>
					tapmytab
				</h1>
			)}
		</WithOptionsMenu>
	);
};

export const Navbar = () => {
	return (
		<FlexRowAlignCenter
			as="nav"
			style={{
				height: "var(--navbar-height)",
				padding: "0px 3.2rem",
				justifyContent: "space-between",
				backgroundColor: "#2F3336",
			}}
		>
			<MainTitle />
		</FlexRowAlignCenter>
	);
};
