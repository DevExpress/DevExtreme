import React from 'react';
import { useState } from 'react';
import SchedulerToolbar from './artifacts/react/renovation/ui/scheduler/header/header';

function App() {
    const [currentView, setCurrentView] = useState('week');
    const [currentDate, setCurrentDate] = useState(new Date(2021, 7, 7));

    return (
        <>
          <SchedulerToolbar
            views={['day', 'week', 'month']}

            currentView={currentView}
            onCurrentViewUpdate={view=> setCurrentView(view)}

            currentDate={currentDate}
            onCurrentDateUpdate={date => setCurrentDate(date)}

            items={[
              {
                defaultElement: 'dateNavigator',
                location: 'before',
              },
              {
                widget: 'dxButton',
                location: 'center',
                options: {
                  text: 'Today',
                  onClick: () => setCurrentDate(new Date()),
                }
              },
              {
                defaultElement: 'viewSwitcher',
                location: 'after',
              }
            ]}
          />
        </>
      );
}

export default App;
