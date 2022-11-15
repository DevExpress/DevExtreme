// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import NxWelcome from './nx-welcome';
import { ControlledSlideToggleExample } from './controlledSlideToggleExample';

export function App() {
    return (
        <>
            <ControlledSlideToggleExample/>
            <NxWelcome title='react-test' />
            <div />
        </>
    );
}

export default App;
