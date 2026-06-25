import { FlexRowAlignCenter } from './Flex/index.tsx'
import { WithOptionsMenu } from './WithOptionsMenu.tsx'
import { StorageService } from '../utils/storage.ts'
import { useBoardStore } from '../stores/useBoardStore.ts'
import { BOARD1, BOARD2, BOARD3, BOARD4 } from '../utils/templates.ts'
import { tc } from '../utils/themeColors.ts'
import { Logo } from './Logo.tsx'
import { SearchBar } from './SearchPopup.tsx'

const MainTitle = () => {
    return (
        <WithOptionsMenu
            options={[
                {
                    label: 'Export Boards',
                    onClick: () => StorageService.exportBoards(),
                },
                {
                    label: 'Import Boards',
                    onClick: async () => {
                        const ok = globalThis.confirm(
                            'Importing replaces all your current boards. Make a backup with "Export Boards" first.\n\nContinue?',
                        )
                        if (!ok) return
                        const boards = await StorageService.importBoards()
                        if (boards) useBoardStore.setState({ boards })
                    },
                },
                {
                    label: 'Reset Board',
                    onClick: async () => {
                        const ok = globalThis.confirm(
                            'Resetting replaces all your current boards with the default template. We\'ll export a backup of your current boards first.\n\nContinue?',
                        )
                        if (!ok) return
                        await StorageService.exportBoards()
                        useBoardStore.setState({ boards: [BOARD1, BOARD2, BOARD3, BOARD4] })
                    },
                },
                {
                    label: 'Submit Issue/Suggestion',
                    onClick: () =>
                        globalThis.open(
                            'https://github.com/krehwell/tapmytab/issues/new',
                            '_blank',
                        ),
                },
                {
                    label: 'Star Us on Github 😉',
                    onClick: () => globalThis.open('https://github.com/krehwell/tapmytab/', '_blank'),
                },
            ]}
        >
            {({ openMenu }) => (
                <h1
                    onClick={openMenu}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', margin: 0 }}
                >
                    <Logo height={27} />
                </h1>
            )}
        </WithOptionsMenu>
    )
}

export const Navbar = () => {
    return (
        <FlexRowAlignCenter
            as='nav'
            style={{
                height: 'var(--navbar-height)',
                padding: '0px 3.2rem',
                justifyContent: 'space-between',
                backgroundColor: tc.surfaceInput,
            }}
        >
            <MainTitle />
            <SearchBar style={{ marginLeft: 'auto' }} />
        </FlexRowAlignCenter>
    )
}
