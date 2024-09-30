import logo from './logo.svg'
import './App.css'
import { TemplateContent } from '../TemplateContent'

export const App = ({ isExtension }: { isExtension: boolean }) => {
    return (
        <>
            {isExtension && (
                <img
                    src={chrome.runtime.getURL(logo)}
                    className="App-logo"
                    alt="logo"
                />
            )}
            {!isExtension && (
                <h1 className="text-center border-solid rounded-md p-2">
                    This is not extension
                </h1>
            )}
            <TemplateContent />
        </>
    )
}
