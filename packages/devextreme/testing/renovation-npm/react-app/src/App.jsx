/* eslint-disable no-unused-vars */
import 'devextreme/dist/css/dx.light.css';
import Button from '@devextreme/react/button';

export const data = [
    {
        text: 'Website Re-Design Plan',
        startDate: new Date('2021-03-29T16:30:00.000Z'),
        endDate: new Date('2021-03-29T18:30:00.000Z'),
    }
];
const currentDate = new Date(2021, 2, 28);
const views = ['week', 'month'];

function App() {
    return (
        <div className="App">
            <Button
                text="Click me"
            />
        </div>
    );
}

export default App;
