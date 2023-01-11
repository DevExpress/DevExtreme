/* eslint-disable no-unused-vars */
import 'devextreme/dist/css/dx.light.css';
import Button from '@devextreme/react/button';
// import Scheduler from '@devextreme/react/scheduler';

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
            {/* <Scheduler
                timeZone="America/Los_Angeles"
                dataSource={data}
                views={views}
                defaultCurrentView="week"
                defaultCurrentDate={currentDate}
                height={600}
                startDayHour={9}
            /> */}
        </div>
    );
}

export default App;
