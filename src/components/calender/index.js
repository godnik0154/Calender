import React from 'react';
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Eventcalendar, snackbar, setOptions, Popup, Button, Input, Textarea, Switch, Datepicker, SegmentedGroup, SegmentedItem } from '@mobiscroll/react';
import './style.css'

setOptions({
    theme: 'ios',
    themeVariant: 'light'
});

const defaultEvents = [{
    id: 1,
    start: '2021-11-08T13:00',
    end: '2021-11-08T13:30',
    title: 'Lunch @ Butcher\'s',
    description: '',
    allDay: false,
    status: 'free',
    color: '#26c57d'
}, {
    id: 2,
    start: '2021-11-02T15:00',
    end: '2021-11-02T16:00',
    title: 'General orientation',
    description: '',
    allDay: false,
    status: 'busy',
    color: '#fd966a'
}, {
    id: 3,
    start: '2021-11-01T18:00',
    end: '2021-11-01T22:00',
    title: 'Dexter BD',
    description: '',
    allDay: false,
    status: 'free',
    color: '#37bbe4'
}, {
    id: 4,
    start: '2021-11-03T10:30',
    end: '2021-11-03T11:30',
    title: 'Stakeholder mtg.',
    description: '',
    allDay: false,
    status: 'busy',
    color: '#d00f0f'
}];

const responsivePopup = {
    medium: {
        display: 'anchored',
        width: 400,
        fullScreen: false,
        touchUi: false
    }
};

function App() {
    const [myEvents, setMyEvents] = React.useState(defaultEvents);
    const [tempEvent, setTempEvent] = React.useState(null);
    const [isOpen, setOpen] = React.useState(false);
    const [isEdit, setEdit] = React.useState(false);
    const [anchor, setAnchor] = React.useState(null);
    const [start, startRef] = React.useState(null);
    const [end, endRef] = React.useState(null);
    const [popupEventTitle, setTitle] = React.useState('');
    const [popupEventDescription, setDescription] = React.useState('');
    const [popupEventAllDay, setAllDay] = React.useState(true);
    const [popupEventDate, setDate] = React.useState([]);
    const [popupEventStatus, setStatus] = React.useState('busy');
    const [mySelectedDate, setSelectedDate] = React.useState(new Date());

    const saveEvent = React.useCallback(() => {
        const newEvent = {
            id: tempEvent.id,
            title: popupEventTitle,
            description: popupEventDescription,
            start: popupEventDate[0],
            end: popupEventDate[1],
            allDay: popupEventAllDay,
            status: popupEventStatus,
            color: tempEvent.color
        };
        if (isEdit) {

            const index = myEvents.findIndex(x => x.id === tempEvent.id);;
            const newEventList = [...myEvents];

            newEventList.splice(index, 1, newEvent);
            setMyEvents(newEventList);

        } else {

            setMyEvents([...myEvents, newEvent]);

        }
        setSelectedDate(popupEventDate[0]);

        setOpen(false);
    }, [isEdit, myEvents, popupEventAllDay, popupEventDate, popupEventDescription, popupEventStatus, popupEventTitle, tempEvent]);

    const deleteEvent = React.useCallback((event) => {
        setMyEvents(myEvents.filter(item => item.id !== event.id));
        setTimeout(() => {
            snackbar({
                button: {
                    action: () => {
                        setMyEvents(prevEvents => [...prevEvents, event]);
                    },
                    text: 'Undo'
                },
                message: 'Event deleted'
            });
        });
    }, [myEvents]);

    const loadPopupForm = React.useCallback((event) => {
        setTitle(event.title);
        setDescription(event.description);
        setDate([event.start, event.end]);
        setAllDay(event.allDay || false);
        setStatus(event.status || 'busy');
    }, []);



    const titleChange = React.useCallback((ev) => {
        setTitle(ev.target.value);
    }, []);

    const descriptionChange = React.useCallback((ev) => {
        setDescription(ev.target.value);
    }, []);

    const allDayChange = React.useCallback((ev) => {
        setAllDay(ev.target.checked);
    }, []);

    const dateChange = React.useCallback((args) => {
        setDate(args.value);
    }, []);

    const statusChange = React.useCallback((ev) => {
        setStatus(ev.target.value);
    }, []);

    const onDeleteClick = React.useCallback(() => {
        deleteEvent(tempEvent);
        setOpen(false);
    }, [deleteEvent, tempEvent]);



    const onSelectedDateChange = React.useCallback((event) => {
        setSelectedDate(event.date);
    }, []);

    const onEventClick = React.useCallback((args) => {
        setEdit(true);
        setTempEvent({ ...args.event });

        loadPopupForm(args.event);
        setAnchor(args.domEvent.target);
        setOpen(true);
    }, [loadPopupForm]);

    const onEventCreated = React.useCallback((args) => {
        setEdit(false);
        setTempEvent(args.event)

        loadPopupForm(args.event);
        setAnchor(args.target);

        setOpen(true);
    }, [loadPopupForm]);

    const onEventDeleted = React.useCallback((args) => {
        deleteEvent(args.event)
    }, [deleteEvent]);

    const onEventUpdated = React.useCallback((args) => {

    }, []);


    const controls = React.useMemo(() => popupEventAllDay ? ['date'] : ['datetime'], [popupEventAllDay]);
    const responsiveOptions = React.useMemo(() => popupEventAllDay ? {
        medium: {
            controls: ['calendar'],
            touchUi: false
        }
    } : {
            medium: {
                controls: ['calendar', 'time'],
                touchUi: false
            }
        }, [popupEventAllDay]);


    const headerText = React.useMemo(() => isEdit ? 'Edit event' : 'New Event', [isEdit]);
    const popupButtons = React.useMemo(() => {
        if (isEdit) {
            return ['cancel', {
                handler: () => {
                    saveEvent();
                },
                keyCode: 'enter',
                text: 'Save',
                cssClass: 'mbsc-popup-button-primary'
            }];
        } else {
            return ['cancel', {
                handler: () => {
                    saveEvent();
                },
                keyCode: 'enter',
                text: 'Add',
                cssClass: 'mbsc-popup-button-primary'
            }];
        }
    }, [isEdit, saveEvent]);

    const onClose = React.useCallback(() => {
        if (!isEdit) {
            setMyEvents([...myEvents]);
        }
        setOpen(false);
    }, [isEdit, myEvents]);

    const [view, setView] = React.useState('month');

    const [calView, setCalView] = React.useState(
        {
            calendar:
            {
                labels: true,
                type: 'month'
            }
        }
    );


    const changeView = (event) => {
        let calView;

        console.log(event.target.value);
        
        switch (event.target.value) {
            case 'workweek':
                calView = {
                    schedule: { type: 'week', startDay: 1, endDay: 5}
                }
                break;
            case 'week':
                calView = {
                    schedule: { type: 'week' }
                }
                break;
            case 'month':
                calView = {
                    calendar:
                    {
                        labels: true,
                        type: 'month'
                    }
                }
                break;
            case 'day':
                default:
                    calView = {
                        schedule: { type: 'day' }
                    }
                    break;
        }

        setView(event.target.value);
        setCalView(calView);
    }

    return <div>
        <div className="md-event-listing-picker">
            <SegmentedGroup value={view} onChange={changeView}>
                <SegmentedItem value="workweek">
                    Work week
                </SegmentedItem>
                <SegmentedItem value="week">
                    Week
                </SegmentedItem>
                <SegmentedItem value="month">
                    Month
                </SegmentedItem>
                <SegmentedItem value="day">
                    Day
                </SegmentedItem>
            </SegmentedGroup>
        </div>
        <Eventcalendar
            view={calView}
            data={myEvents}
            clickToCreate="double"
            dragToCreate={true}
            dragToMove={true}
            dragToResize={true}
            selectedDate={mySelectedDate}
            onSelectedDateChange={onSelectedDateChange}
            onEventClick={onEventClick}
            onEventCreated={onEventCreated}
            onEventDeleted={onEventDeleted}
            onEventUpdated={onEventUpdated}
        />
        <Popup
            display="bottom"
            fullScreen={true}
            contentPadding={false}
            headerText={headerText}
            anchor={anchor}
            buttons={popupButtons}
            isOpen={isOpen}
            onClose={onClose}
            responsive={responsivePopup}
        >
            <div className="mbsc-form-group">
                <Input label="Title" value={popupEventTitle} onChange={titleChange} />
                <Textarea label="Description" value={popupEventDescription} onChange={descriptionChange} />
            </div>
            <div className="mbsc-form-group">
                <Switch label="All-day" checked={popupEventAllDay} onChange={allDayChange} />
                <Input ref={startRef} label="Starts" />
                <Input ref={endRef} label="Ends" />
                <Datepicker
                    select="range"
                    controls={controls}
                    touchUi={true}
                    startInput={start}
                    endInput={end}
                    showRangeLabels={false}
                    responsive={responsiveOptions}
                    onChange={dateChange}
                    value={popupEventDate}
                />
                <SegmentedGroup onChange={statusChange}>
                    <SegmentedItem value="busy" checked={popupEventStatus === 'busy'}>Show as busy</SegmentedItem>
                    <SegmentedItem value="free" checked={popupEventStatus === 'free'}>Show as free</SegmentedItem>
                </SegmentedGroup>
                {isEdit && <div className="mbsc-button-group">
                    <Button className="mbsc-button-block" color="danger" variant="outline" onClick={onDeleteClick}>Delete event</Button>
                </div>}
            </div>
        </Popup>
    </div>
}

export default App;