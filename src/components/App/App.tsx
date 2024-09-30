import logo from './logo.svg'
import './App.css'
import { TemplateContent } from '../TemplateContent'

export const App = ({ isExtension }: { isExtension: boolean }) => {
    return (
        <>
            <h1 className="text-center border-solid rounded-md p-2">
                tapmytab
            </h1>
            <TemplateContent />
        </>
    )
}
