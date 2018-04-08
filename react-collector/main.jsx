//
// MarkerComponent
//
const COLLECTOR_ENDPOINT = "http://localhost:8080"

class MarkerComponent extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
           hovering: false,
           count: -1, // undefined
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
        // initialize counter for device
        this.updatePeopleCount()

        // regularly update counter
        const self = this;
        setInterval(function () {
            self.updatePeopleCount()
        }, 3 * 1000); // in milliseconds
    }

    render() {
        const { x, y, location, ip, name } = this.props;
        const { count } = this.state;

        const diameter = `${this.countToDiameter(count)}px`

        let className = ""
        if (count >= 3)
            className = "High"
        else if (count >= 1)
            className = "Low"
        else if (count >= 0)
            className = "Nobody"
        else 
            className = "Undefined"

        var countLabel = "" + count;
        if (count == -1) {
            countLabel == "not counting";
        }

        return (
            <div className="marker-container" style={{ top: y, left: x }}>
                <div className="marker-inner">
                    <div className={"count-circle " + className}
                        style={{ width: diameter, height: diameter }} />
                    <div className="hover-circle"
                        {...this.hoverProps()} />
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
                <img src="img/devnetcreate-map.png" />
                <MarkerComponent device="Workbench1" location="Workshop 1" x="819px" y="398px" ip="http://192.168.1.32" />
                <MarkerComponent device="Workbench2" location="Workshop 2" x="662px" y="536px" ip="http://192.168.1.33" />
                <MarkerComponent device="Workbench3" location="Workshop 3" x="954px" y="536px" ip="http://192.168.1.34" />
                <MarkerComponent device="Workbench4" location="Workshop 4" x="1113px" y="280px" ip="http://192.168.1.35" />
                <MarkerComponent device="Workbench5" location="Workshop 5" x="978px" y="372px" ip="http://192.168.1.36" />
            </div>

        )
    }
}

ReactDOM.render(
    <MapComponent />
    , document.querySelector("#container")
)