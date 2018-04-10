//
// MarkerComponent
//
const COLLECTOR_ENDPOINT = "http://localhost:8080"

class MarkerComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hovering: false,
            count: -1, // undefined
            location: "unknown",
            ip: "unknown"
        }
    }

    countToDiameter(count) {
        if (count == -1) {
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
            .then(device => this.setState({ location: device.location, ip: device.ip }))
            .catch(err => {
                // something went wrong
                console.log(`could not load configuration for device: ${this.props.device}, err: ${err}`)
            })
    }

    updatePeopleCount = () => {
        const url = `${COLLECTOR_ENDPOINT}/devices/${this.props.name}/average?period=30`

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
        const { location, ip, count } = this.state;

        const diameter = `${this.countToDiameter(count)}px`

        let className = "Standby" // Defaults to -1
        if (count >= 4)
            className = "High"
        else if (count >= 1)
            className = "Low"
        else if (count == 0)
            className = "Empty"

        var countLabel = "" + count;
        if (count == -1) {
            countLabel == "not counting";
        }

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
                                <span>{ip}</span>
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

//
// MapComponent
//
class MapComponent extends React.Component {
    render() {
        return (
            <div className="map-container">
                <img src="img/Roomkit-map-1600x900.png" />
                <MarkerComponent device="Workbench1" x="929px" y="510px" />
                <MarkerComponent device="Workbench2" x="785px" y="626px" />
                <MarkerComponent device="Workbench3" x="956px" y="714px" />
                <MarkerComponent device="Workbench4" x="1266px" y="516px" />
            </div>

        )
    }
}

ReactDOM.render(
    <MapComponent />
    , document.querySelector("#container")
)
