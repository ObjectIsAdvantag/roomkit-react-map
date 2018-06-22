//
// MarkerComponent
//
class MarkerComponent extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            hovering: false
        };
    }

    countToDiameter(count) {
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
    };

    render() {
        const { x, y, location, ipAddress, count } = this.props;

        const diameter = `${this.countToDiameter(count)}px`;

        let className = "";
        if (count > 5)
            className = "High"
        else if (count >= 1)
            className = "Medium"
        else if (count < 1)
            className = "Low";

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
                                <span>{ipAddress}</span>
                            </div>
                            <div>
                                <span>People Count</span>
                                <span>{count || "-"}</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
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
                <MarkerComponent location="Workshop 1" x="819px" y="398px" count="-1" ipAddress="192.168.1.32" />
            </div>
        );
    }
}

ReactDOM.render(
    <MapComponent />
    , document.querySelector("#container")
);  
