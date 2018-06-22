
import React, { Component } from 'react';
import './MarkerComponent.css'

const COLLECTOR_ENDPOINT = "http://localhost:8080"
class MarkerComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hovering: false,
            count: -1, // undefined
            location: "unknown",
            ipAddress: "unknown"
        }
    }

    countToDiameter(count) {
        if (count === -1) {
            return 30;
        }

        return ((count * 20) + 30);
    }

    hovering(bool) {
        this.setState({
            hovering: bool
        });
    }

    hoverProps = () => {
        return {
            onMouseEnter: () => this.hovering(true),
            onMouseLeave: () => this.hovering(false)
        }
    }

    loadConfiguration = () => {
        const url = `${COLLECTOR_ENDPOINT}/devices/${this.props.device}`

        fetch(url)
            .then(response => {
                // forcing to run into the catch block when HTTP status code errors
                if (response.ok) {
                    return response.json()
                }

                throw new Error('Something went wrong ...')
            })
            .then(device => this.setState({ location: device.location, ipAddress: device.ipAddress }))
            .catch(err => {
                // something went wrong
                console.log(`could not load configuration for device: ${this.props.device}, err: ${err}`)
            })
    }

    updatePeopleCount = () => {
        const url = `${COLLECTOR_ENDPOINT}/devices/${this.props.device}/average?period=30`

        fetch(url)
            .then(response => {
                // forcing to run into the catch block when HTTP status code errors
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong ...');
                }
            })
            .then(data => this.setState({ count: data.peopleCount }))
            .catch(error => {
                // something went wrong
                this.setState({ count: -1 })
            })
    }

    componentDidMount() {
        // load settings for device
        this.loadConfiguration()

        // regularly update counter
        const self = this;
        setInterval(function () {
            self.updatePeopleCount()
        }, 3 * 1000); // in milliseconds
    }

    render() {
        const { x, y } = this.props;
        const { location, ipAddress, count } = this.state;

        // Pick the outer circle style depending on the PeopleCount value
        let className = "Standby" // Defaults for -1 (not counting) and undefined (no capability, wrong address)
        if (count > 3)
            className = "High"
        else if (count > 0)
            className = "Low"
        else if (count == 0)
            className = "Empty"

        const diameter = `${this.countToDiameter(count)}px`

        let countLabel;
        if (count === undefined)
            countLabel = "N/A"; // configuration error
        else if (count === -1)
            countLabel == "not counting"
        else countLabel = "" + Math.round(count + 0.49) + " (" + Math.round(count*100)/100 + ")"

        return (
            <div className="marker-container" style={{ top: y, left: x }}>
                <div className="marker-inner">
                    <div className={"count-circle " + className}
                        style={{ width: diameter, height: diameter }} />
                    <div className="hover-circle" {...this.hoverProps()} />
                    <div className="inner-circle" {...this.hoverProps()} />
                    {this.state.hovering &&
                        <div className="info-card"
                            style={{ position: "absolute" }}
                            {...this.hoverProps()}>
                            <div>
                                <span>Location</span>
                                <span>{location}</span>
                            </div>
                            <div>
                                <span>IP Address</span>
                                <span>{ipAddress}</span>
                            </div>
                            <div>
                                <span>People Count</span>
                                <span>{countLabel}</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}

export default MarkerComponent;
