import React from "react";
import { FlexRowAlignCenter } from "./Flex/index.tsx";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import {
	CaretDown,
	GoogleLogo,
	TwitterLogo,
	YoutubeLogo,
} from "@phosphor-icons/react";
import { WithOptionsMenu } from "./WithOptionsMenu.tsx";
import { Button } from "./Button.tsx";
import { useLocalStorage } from "react-use";
import { StorageService } from "../utils/chromeStorage.ts";

enum SearchOption {
	Youtube,
	Google,
	Twitter,
}

const SocMedInput = ({ style }: { style?: React.CSSProperties }) => {
	const [searchWith_, setSearchWith] = useLocalStorage(
		"default-search-with",
		SearchOption.Youtube,
	);
	const searchWith = searchWith_ || SearchOption.Youtube;

	const SEARCH_OPTIONS = [
		{
			label: "Youtube",
			node: <YoutubeLogo size={18} />,
			onClick: () => setSearchWith(SearchOption.Youtube),
		},
		{
			label: "Google",
			node: <GoogleLogo size={18} />,
			onClick: () => setSearchWith(SearchOption.Google),
		},
		{
			label: "Twitter",
			node: <TwitterLogo size={18} />,
			onClick: () => setSearchWith(SearchOption.Twitter),
		},
	];

	return (
		<FlexRowAlignCenter
			style={{
				backgroundColor: "#2B2F32",
				borderRadius: "12px",
				color: "#ffffff",
				height: "4rem",
				padding: "0 0.8rem",
				gap: "1.2rem",
				...style,
			}}
		>
			<WithOptionsMenu options={SEARCH_OPTIONS}>
				{({ openMenu }) => (
					<Button
						onClick={openMenu}
						style={{ height: "3rem", padding: "0 1rem", gap: "0.5rem" }}
					>
						{SEARCH_OPTIONS[searchWith].node}
						<CaretDown size={12} />
					</Button>
				)}
			</WithOptionsMenu>
			<FlexRowAlignCenter
				as={TextareaAutosize}
				maxRows={1}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
						const query = e.currentTarget.value;

						if (searchWith === SearchOption.Youtube) {
							chrome.tabs.update({
								url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
							});
						} else if (searchWith === SearchOption.Google) {
							chrome.tabs.update({
								url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
							});
						} else if (searchWith === SearchOption.Twitter) {
							chrome.tabs.update({
								url: `https://twitter.com/search?q=${encodeURIComponent(query)}`,
							});
						}
					}
				}}
				placeholder={`Search from ${SEARCH_OPTIONS[searchWith].label}`}
				style={{
					backgroundColor: "transparent",
					resize: "none",
					fontSize: "1.3rem",
					width: "28.8rem",
					paddingBlock: "0.5rem",
					verticalAlign: "center",
				}}
			/>
		</FlexRowAlignCenter>
	);
};

const MainTitle = () => {
	return (
		<WithOptionsMenu
			options={[
				{
					label: "Export Boards",
					onClick: () => StorageService.exportBoards(),
				},
				{
					label: "Submit Issue/Suggestion",
					onClick: () =>
						globalThis.open(
							"https://github.com/krehwell/tapmytab/issues/new",
							"_blank",
						),
				},
				{
					label: "Star Repo(Open Source) 😉",
					onClick: () =>
						globalThis.open("https://github.com/krehwell/tapmytab/", "_blank"),
				},
			]}
		>
			{({ openMenu }) => (
				<h1
					onClick={openMenu}
					style={{
                        cursor: "pointer",
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
			<SocMedInput style={{ marginLeft: "auto" }} />
		</FlexRowAlignCenter>
	);
};
