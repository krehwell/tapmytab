import "./editor.css";

import Link from "@tiptap/extension-link";
import {
	Editor as TiptapEditor,
	EditorContent,
	useEditor,
} from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import debounce from "lodash/debounce";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import { LinkMenu } from "./LinkMenu.tsx";
import Box from "@mui/material/Box";

const hasAccent = ({ text }: { text: string }) => {
	const isAccent = /[À-ž]/.test(text);
	return isAccent;
};

const extensions = [
	TaskList,
	TaskItem.configure({ nested: true }),
	TextAlign.configure({
		types: ["heading", "paragraph"],
	}),
	StarterKit.configure({
		bulletList: { keepMarks: true, keepAttributes: false },
		orderedList: { keepMarks: true, keepAttributes: false },
	}),
	Link.configure({
		openOnClick: false,
		autolink: true,
		defaultProtocol: "https",
	}),
	Placeholder.configure({
		placeholder: ({ editor }) => {
			if (editor.isActive("heading")) {
				return "";
			}
			return `Start typing (supports markdown). try:

## title 
desc

- list one
- list two
`;
		},
	}),
];

const debouncedOnUpdate = debounce(
	({ editor, onChange }) => onChange({ content: editor?.getHTML() }),
	500,
);

export const useEditorInstance = ({
	content,
	onChange,
	shouldRerenderOnTransaction,
}: {
	content: string;
	onChange?: (props: { content: string }) => void;
	shouldRerenderOnTransaction?: boolean;
}) => {
	const editor = useEditor(
		{
			editable: true,
			extensions,
			content,
			shouldRerenderOnTransaction,
			onUpdate: ({ editor }) => debouncedOnUpdate({ editor, onChange }),
		},
		[],
	);

	useEffect(() => {
		if (!editor) return;
		if (content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	return { editor };
};

export const Editor = ({
	editor,
	style,
}: { editor: TiptapEditor; style: React.CSSProperties }) => {
	const ref = useRef<HTMLDivElement>(null);

	const contentHasAccent = hasAccent({ text: editor.getText() });
	const fontFamily = contentHasAccent ? "Poppins" : "Rumiko Clear";

	return (
		<>
			<Box
				component={EditorContent}
				sx={{
					"& .tiptap *": {
						fontFamily,
					},
				}}
				ref={ref}
				editor={editor}
				style={{
					cursor: "text",
					fontSize: "1.3rem",
					lineHeight: "1",
					padding: "1.6rem 0.8rem",
					wordBreak: "break-word",
					...style,
				}}
				onClick={() => {
					const currEditor = ref.current?.lastChild?.editor;
					if (!currEditor?.isFocused) {
						editor?.chain().focus().run();
					}
				}}
			/>
			{editor && <LinkMenu editor={editor} />}
		</>
	);
};
