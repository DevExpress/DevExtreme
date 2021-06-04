new Promise(resolve => {
    var i = 0;
    const interval = setInterval(() => {
        const appointmentCountInScheduler1 = $('#scheduler1 .dx-scheduler-appointment').length;
        const appointmentCountInScheduler2 = $('#scheduler2 .dx-scheduler-appointment').length;
        if(i > 50 || (appointmentCountInScheduler1 > 0 && appointmentCountInScheduler2 > 0)) {
            clearInterval(interval);
            resolve();
        }
        i++;
    }, 100);
});