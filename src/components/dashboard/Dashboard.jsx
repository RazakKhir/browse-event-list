import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import './Dashboard.scss';
import {Button, Card, Col, Empty, Row, Select, Tooltip} from "antd";
import {BookFilled, BookOutlined} from "@ant-design/icons";
import axios from "axios";

const Dashboard = props => {
    const {Option} = Select;
    const [eventList, setEventList] = useState([]);
    const [displayEvents, setDisplayEvents] = useState([]);
    const [bookmarkList, setBookmarkList] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const cityList = ["Amsterdam", "Berlin", "Rim", "St.Petersburg"];
    const monthList = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        // get bookmark item in storage
        setBookmarkList(JSON.parse(window.localStorage.getItem("bookmarkList")));
        getEventList().then(r => {
            setEventList(r);
            setDisplayEvents(r);
        });
    }, []);

    useEffect(() => {
        console.log("GET response: ", eventList);
        // set bookmark item for first time in storage
        if (eventList && eventList.length > 0 && (!bookmarkList || bookmarkList.length === 0)) {
            let bookmarkStoredList = [];
            for (const item of eventList) {
                let bookmarkStored = {id: item.id, bookmarkFlag: false}
                bookmarkStoredList.push(bookmarkStored);
            }
            // window.localStorage.setItem("bookmarkList", JSON.stringify(bookmarkStoredList));
            setBookmarkList(bookmarkStoredList);
        }
    }, [eventList]);

    // get data from api
    const getEventList = async () => {
        try {
            const response = await axios.get("https://raw.githubusercontent.com/xsolla/test-task-frontend/master/events.json");
            if (response && response.data && response.data.length > 0) {
                return response.data;
            } else {
                console.error("Error: Empty response!");
                return [];
            }
        } catch (e) {
            console.error("Error: ", e);
            return [];
        }
    };

    const displayBackground = value => {
        return {
            background: `url("${value}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: 250,
            width: 350,
            borderRadius: 5,
            margin: "8px 5px"
        };
    };

    const formatId = idNo => {
        if (idNo && idNo.length > 1) return idNo.charAt(0) === "0" ? idNo.slice(1) : idNo;
        return idNo;
    };

    const onChangeCity = value => {
        setSelectedCity(value);
        setDisplayEvents(eventList.filter((el) => {
            if (selectedMonth) {
                return el.city === value && getMonthFormat(el.date).toLowerCase() === selectedMonth.toLowerCase();
            }
            return el.city === value;
        }));
    };

    const onChangeMonth = value => {
        setSelectedMonth(value);
        setDisplayEvents(eventList.filter((el) => {
            if (selectedCity) {
                return el.city === selectedCity && getMonthFormat(el.date).toLowerCase() === value.toLowerCase();
            }
            return getMonthFormat(el.date).toLowerCase() === value.toLowerCase();
        }));
    };

    const getMonthFormat = (dateRaw) => {
        let arr = dateRaw.split(".");
        const tempDate = new Date(`${arr[1]}.${arr[0]}.${arr[2]}`);
        return tempDate.toLocaleString("default", {month: "long"});
    };

    const checkBookmark = value => {
        if(bookmarkList && bookmarkList.length > 0){
            let bookmarkData = bookmarkList.find((data) => {
                return data.id === value;
            });
            // return bookmarkData ? bookmarkData.bookmarkFlag : false;
            return bookmarkData.bookmarkFlag;
        }
        return false;
    };

    function onChangeBookmark(value) {
        let newBookmarkList = bookmarkList;
        for (const item of newBookmarkList){
            if(item.id === value) {
                item.bookmarkFlag = !item.bookmarkFlag;
                break;
            }
        }
        setBookmarkList([...newBookmarkList]);
    };

    const onClickReset = () => {
        setDisplayEvents(eventList);
        setSelectedMonth("");
        setSelectedCity("");
    };

    window.addEventListener('beforeunload', (event) => {
        window.localStorage.setItem("bookmarkList", JSON.stringify(bookmarkList));
    });

    return (
        <>
            <Row gutter={24} align="middle" className={"main-card"}
                 style={{marginRight: 0, marginLeft: 0}} // need to put this in order to remove horizontal scroll
            >
                <Col xs={1} sm={2} md={4}/>
                <Col xs={22} sm={20} md={16}>
                    <div className={"card-wrapper"}>
                        <Card title="Event Listing" bordered={false}>
                            <Row gutter={24}>
                                <Col sm={24} md={12} lg={7} className={"form-control"}>
                                    <span style={{marginRight: 5, paddingTop: 3, width: "25%"}}>City :</span>
                                    <Select defaultValue={"Please select"} onChange={(e) => {
                                        onChangeCity(e);
                                    }} style={{float: "right", width: "75%"}}>
                                        {/*<Option value={"Please select"} key={0} disabled={true}>{"Please select"}</Option>*/}
                                        {
                                            cityList.map(el => <Option value={el} key={el}>{el}</Option>)
                                        }
                                    </Select>
                                </Col>
                                <Col sm={24} md={12} lg={7} className={"form-control"}>
                                    <span style={{marginRight: 5, paddingTop: 3, width: "30%"}}>Month :</span>
                                    <Select defaultValue={"Please select"} onChange={(e) => {
                                        onChangeMonth(e);
                                    }} style={{float: "right", width: "70%"}}>
                                        {
                                            monthList.map(el => <Option value={el} key={el}>{el}</Option>)
                                        }
                                    </Select>
                                </Col>
                                <Col sm={24} md={12} lg={7} className={"form-control"}>
                                    <Tooltip title="Reset filter">
                                        <Button onClick={() => {
                                            onClickReset();
                                        }}>Reset</Button>
                                    </Tooltip>
                                </Col>
                            </Row>
                            <br/>
                            <Row gutter={24} justify={"space-evenly"}>
                                {
                                    displayEvents.map(el =>
                                        <div
                                            key={el.id}
                                            style={displayBackground(el.image)}
                                        >
                                            <div className={"event-row-wrapper"}>
                                                <div className={"event-id"}>{formatId(el.id)}</div>
                                                <div className={"event-bookmark"}>
                                                    {
                                                        !checkBookmark(el.id) &&
                                                        <Tooltip title="Add Bookmark">
                                                            <BookOutlined onClick={() => onChangeBookmark(el.id)}/>
                                                        </Tooltip>
                                                    }
                                                    {
                                                        checkBookmark(el.id) &&
                                                        <Tooltip title="Remove Bookmark">
                                                            <BookFilled onClick={() => onChangeBookmark(el.id)}/>
                                                        </Tooltip>
                                                    }
                                                </div>
                                                <div className={"event-title"}>{el.name}</div>
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    displayEvents.length === 0 && <Empty/>
                                }
                            </Row>
                        </Card>
                    </div>
                </Col>
                <Col xs={1} sm={2} md={4}/>
            </Row>
        </>
    );
};

Dashboard.propTypes =
    {}
;

export default Dashboard;