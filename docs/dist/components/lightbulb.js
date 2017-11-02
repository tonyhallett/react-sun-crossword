"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var blackStroke = "#000000";
//will have to add icon for hover 
var Lightbulb = (function (_super) {
    __extends(Lightbulb, _super);
    function Lightbulb(props) {
        return _super.call(this, props) || this;
    }
    //onElements: SVGElement[] = [];
    Lightbulb.prototype.switchOn = function () {
        this._addOnClass(this.rays);
        this._addOnClass(this.innerLight);
        this._addOnClass(this.bulbOuter);
        this._addOnClass(this.bulbGlow);
        this._addOnClass(this.solveCheatTextFilament);
    };
    Lightbulb.prototype.switchOff = function () {
        this._removeOnClass(this.rays);
        this._removeOnClass(this.innerLight);
        this._removeOnClass(this.bulbOuter);
        this._removeOnClass(this.bulbGlow);
        this._removeOnClass(this.solveCheatTextFilament);
    };
    Lightbulb.prototype.componentWillReceiveProps = function (nextProps) {
        if (nextProps.on !== this.props.on) {
            if (nextProps.on) {
                this.switchOn();
            }
            else {
                this.switchOff();
            }
        }
    };
    Lightbulb.prototype._addOnClass = function (svgElement) {
        var classNames = svgElement.getAttribute('class');
        svgElement.setAttribute('class', classNames + " on");
    };
    Lightbulb.prototype._removeOnClass = function (svgElement) {
        var classNames = svgElement.getAttribute('class');
        svgElement.setAttribute('class', classNames.replace(" on", ""));
    };
    Lightbulb.prototype.shouldComponentUpdate = function () {
        return false;
    };
    Lightbulb.prototype.render = function () {
        //stroke default is none
        //fill-opacity/stroke-opacity is 1
        //fill="rgb(255,255,109)"
        var _this = this;
        //have had to correct slightly displaced innerLight - later will make bulb outer to be a clip.  Will then be able to have
        //symbol for innerLight and part of the clip
        //viewBox="0 0 210 297"
        return React.createElement("svg", { version: "1.1", width: "150px", height: "150px", viewBox: "90 90 150 150", xmlns: "http://www.w3.org/2000/svg" },
            React.createElement("defs", null,
                React.createElement("filter", { id: "onGlowFilter" + this.props.id, x: "-.2", y: "-.16", width: "1.38", height: "1.33", colorInterpolationFilters: "sRGB" },
                    React.createElement("feFlood", { floodColor: this.props.onGlowColour, result: "flood" }),
                    React.createElement("feComposite", { in: "flood", in2: "SourceGraphic", operator: "in", result: "composite1" }),
                    React.createElement("feGaussianBlur", { in: "composite1", result: "blur", stdDeviation: "3" }),
                    React.createElement("feOffset", { dx: "0", dy: "0", result: "offset" }),
                    React.createElement("feComposite", { in: "SourceGraphic", in2: "offset", result: "composite2" })),
                React.createElement("filter", { id: "bulbShadowFilter", width: "1.24", height: "1.28", colorInterpolationFilters: "sRGB" },
                    React.createElement("feFlood", { floodColor: "rgb(188,188,188)", result: "flood" }),
                    React.createElement("feComposite", { in: "flood", in2: "SourceGraphic", operator: "in", result: "composite1" }),
                    React.createElement("feGaussianBlur", { in: "composite1", result: "blur", stdDeviation: "1.3" }),
                    React.createElement("feOffset", { dx: "2.3", dy: "3.2", result: "offset" }),
                    React.createElement("feComposite", { in: "SourceGraphic", in2: "offset", result: "composite2" })),
                React.createElement("filter", { id: "solveCheatDropShadow", width: "1.33", height: "1.88", colorInterpolationFilters: "sRGB" },
                    React.createElement("feFlood", { floodColor: "rgb(186,186,186)", result: "flood" }),
                    React.createElement("feComposite", { in: "flood", in2: "SourceGraphic", operator: "in", result: "composite1" }),
                    React.createElement("feGaussianBlur", { in: "composite1", result: "blur", stdDeviation: "0.6" }),
                    React.createElement("feOffset", { dx: "1.15", dy: "1.6", result: "offset" }),
                    React.createElement("feComposite", { in: "SourceGraphic", in2: "offset", operator: "over", result: "composite2" })),
                React.createElement("radialGradient", { id: "innerLightGradient" + this.props.id, cx: "32.615", cy: "73.593", r: "15.58", gradientTransform: "matrix(1 0 0 1.1892 44.834 -3.3698)", gradientUnits: "userSpaceOnUse" },
                    React.createElement("stop", { stopColor: this.props.innerGlowColour, offset: "0" }),
                    React.createElement("stop", { stopColor: "#c1bab4", stopOpacity: "0", offset: "1" })),
                React.createElement("symbol", { id: "ray" + this.props.id },
                    React.createElement("rect", { x: "24.757", fill: this.props.rayColour, y: "57.906", width: "2.9766", height: "8.3391", ry: "2", stroke: "#000", strokeWidth: ".26458" })),
                React.createElement("symbol", { id: "baseEllipse" },
                    React.createElement("ellipse", { cx: "79.187", cy: "104.97", rx: "5.9718", ry: ".4009", fill: "rgb(68,85,68)", stroke: "black", strokeWidth: ".26458" })),
                React.createElement("symbol", { id: "bulbOuterOutside" },
                    React.createElement("path", { d: "m79.013 63.392c-3.1797 0-5.0589 0.41385-7.4972 1.6511-4.0098 2.0346-7.0737 5.5852-8.4419 9.7839-0.87878 2.697-1.0685 4.6-0.71158 7.122 0.4993 3.5278 1.5686 5.9263 3.9946 8.9597 1.3922 1.7407 2.8905 4.3266 3.4494 5.9531 0.62245 1.8116 0.78135 3.5813 0.78135 8.6884 0 5.0311 0.15179 5.5978 0.46302 6.0653 0.33935 0.50975 0.95787 0.97846 1.48 1.3849 1.1616 0.80863 1.6839 1.0454 3.2163 1.4728 1.1214 0.31275 6.2919 0.27701 7.0833-0.12455 0.83511-0.36785 2.9092-1.0732 3.9036-2.5704 0.39629-0.37386 0.47317-1.2253 0.59634-6.6146 0.14352-6.2795 0.21278-6.762 1.3994-9.757 0.48409-1.2218 1.7115-3.0912 3.5615-5.424 2.3991-3.025 3.2667-5.7287 3.2691-10.186 0.0016-3.3419-0.20018-4.3635-1.3606-6.8792-1.6721-3.6247-5.3118-7.0936-8.7953-8.383-2.8184-1.0432-3.3725-1.142-6.3913-1.142z" })),
                React.createElement("symbol", { id: "solveCheatTextFilament" + this.props.id },
                    React.createElement("text", { fontFamily: "sans-serif", fontSize: "7.0938px", fontWeight: "bold", letterSpacing: "0px", strokeWidth: ".17735", wordSpacing: "0px", style: { lineHeight: 1.25 } },
                        React.createElement("tspan", { x: "68", y: "89.48671", fontFamily: "sans-serif", fontSize: "7.0938px", fontWeight: "bold", strokeWidth: ".17735" }, this.props.text)),
                    React.createElement("path", { d: "m68.308 89.377v0.79427h9.355v11.324h0.52917v-11.324h1.3229v11.324h0.52917v-11.324h9.4512v-0.79427z" }))),
            React.createElement("g", { id: this.props.id, transform: "scale(2)" },
                React.createElement("use", { className: "bulbShadow", fill: "#fffffc", fillOpacity: ".79879", filter: "url(#bulbShadowFilter)", xlinkHref: "#bulbOuterOutside" }),
                React.createElement("use", { ref: function (bulbGlow) { _this.bulbGlow = bulbGlow; }, className: "onGlow", fill: this.props.onGlowColour, filter: "url(#onGlowFilter" + this.props.id + ")", xlinkHref: "#bulbOuterOutside" }),
                React.createElement("use", { className: "bulb", fill: "#e8e8e6", fillOpacity: ".87843", xlinkHref: "#bulbOuterOutside" }),
                React.createElement("g", null,
                    React.createElement("use", { fill: "black", className: "solveCheatTextFilamentShadow", xlinkHref: "#solveCheatTextFilament" + this.props.id, filter: "url(#solveCheatDropShadow)" }),
                    React.createElement("use", { fill: "black", ref: function (solveCheatTextFilament) { _this.solveCheatTextFilament = solveCheatTextFilament; }, className: "solveCheatTextFilament", xlinkHref: "#solveCheatTextFilament" + this.props.id }),
                    React.createElement("path", { ref: function (innerLight) { _this.innerLight = innerLight; }, className: "innerLight", transform: "translate(1.75, -1)", d: "m77.429 65.622c1.5005 0.0045 3.0482 0.08204 3.6943 0.25632 5.548 1.4963 9.8467 5.5768 11.461 10.879 0.60138 1.9756 0.59088 6.7825-0.0186 8.5385-0.80919 2.3313-2.0099 4.464-3.5037 6.2234-2.2279 2.624-3.4806 6.4747-3.9791 9.3049-0.41015 2.3285 0.01812 1.802-3.4044 1.802-2.4507-0.0229-4.9016-0.0444-7.3525-0.0243-2.0819 0.0209-3.3165 6e-3 -3.4174-0.0951-0.08305-0.0592-0.58661-0.85246-0.73484-1.6826-0.13096-0.73338-0.39469-1.7619-0.92656-3.622-0.46103-1.6123-1.9513-4.0188-3.3249-5.7299-1.3805-1.7198-2.6735-3.5858-3.2809-5.6472-0.08663-0.29398-0.3474-1.4221-0.55862-2.5135-0.79741-4.0298 0.67382-8.9932 3.9584-12.58 1.7242-1.8829 4.4521-3.8582 6.4198-4.4891 0.58055-0.18615 1.1991-0.38321 1.557-0.43925 0.45719-0.11737 1.9107-0.18585 3.4112-0.18138z", fill: "url(#innerLightGradient" + this.props.id + ")" })),
                React.createElement("path", { fill: this.props.bulbOuterColour, ref: function (bulbOuter) { _this.bulbOuter = bulbOuter; }, className: "bulbOuter", transform: "scale(.26458)", d: "m299.13 240.09c-12.018 0-19.12 1.5642-28.336 6.2402-15.155 7.69-26.735 21.109-31.906 36.979-3.3214 10.193-4.0386 17.386-2.6894 26.918 1.8871 13.333 5.9285 22.399 15.098 33.863 5.2617 6.579 10.925 16.353 13.037 22.5 2.3526 6.847 2.9531 13.536 2.9531 32.838 0 19.015 0.57369 21.157 1.75 22.924 1.2826 1.9266 3.6203 3.6981 5.5938 5.2344 4.3902 3.0562 6.3642 3.9512 12.156 5.5664 4.2385 1.182 23.781 1.047 26.771-0.47071 3.1563-1.3903 10.995-4.0561 14.754-9.7148 1.4978-1.413 1.7884-4.631 2.2539-25 0.54244-23.733 0.80419-25.557 5.2891-36.877 1.8296-4.618 6.4686-11.683 13.461-20.5 9.0675-11.433 12.346-21.652 12.355-38.5 6e-3 -12.631-0.75658-16.492-5.1426-26-6.3197-13.7-20.076-26.81-33.242-31.684-10.652-3.9427-12.746-4.3164-24.156-4.3164zm-0.42188 4.1406c5.6712 0.0169 11.521 0.31007 13.963 0.96875 20.969 5.6554 37.216 21.078 43.316 41.119 2.2729 7.467 2.2332 25.635-0.0703 32.271-3.0584 8.8113-7.5963 16.872-13.242 23.521-8.4204 9.9173-13.155 24.471-15.039 35.168-1.5502 8.8008 0.0685 6.8106-12.867 6.8106-9.2626-0.0867-18.526-0.16777-27.789-0.0918-7.8687 0.0791-12.535 0.0219-12.916-0.35938-0.31387-0.22389-2.2171-3.2219-2.7773-6.3594-0.49496-2.7718-1.4917-6.6592-3.502-13.689-1.7425-6.0938-7.3749-15.189-12.566-21.656-5.2178-6.5-10.104-13.553-12.4-21.344-0.32743-1.1111-1.313-5.375-2.1113-9.5-3.0138-15.231 2.5467-33.99 14.961-47.547 6.5166-7.1163 16.827-14.582 24.264-16.967 2.1942-0.70357 4.5321-1.4484 5.8848-1.6602 1.728-0.44359 7.2214-0.70243 12.893-0.68555z", stroke: "#000" }),
                React.createElement("rect", { className: "baseRect", x: "71.795", y: "102.88", width: "14.402", height: "8.4026", ry: ".826", fill: "#a0b3a0", stroke: "#000", strokeWidth: ".26458" }),
                React.createElement("ellipse", { className: "baseOuterEllipse", cx: "79.022", cy: "113.13", rx: "4.7607", ry: ".65982", fill: "#a0b3a0", stroke: "#000", strokeWidth: ".26458" }),
                React.createElement("use", { transform: "translate(-.19097)", xlinkHref: "#baseEllipse" }),
                React.createElement("use", { transform: "translate(-.21659 2.1716)", width: "100%", height: "100%", xlinkHref: "#baseEllipse" }),
                React.createElement("use", { transform: "translate(-.24221 4.1761)", width: "100%", height: "100%", xlinkHref: "#baseEllipse" }),
                React.createElement("g", { ref: function (raysGroup) { _this.rays = raysGroup; }, className: "rays" },
                    React.createElement("use", { id: "ray1", transform: "rotate(252 50.012 63.755)", width: "100%", height: "100%", xlinkHref: "#ray" + this.props.id }),
                    React.createElement("use", { id: "ray2", transform: "rotate(-72 48.02 46.722)", width: "100%", height: "100%", xlinkHref: "#ray" + this.props.id }),
                    React.createElement("use", { id: "ray3", transform: "rotate(-36 42.251 1.7655)", width: "100%", height: "100%", xlinkHref: "#ray" + this.props.id }),
                    React.createElement("use", { id: "ray4", transform: "translate(52.743 -6.7332)", width: "100%", height: "100%", xlinkHref: "#ray" + this.props.id }),
                    React.createElement("use", { id: "ray5", transform: "rotate(36 63.101 164.45)", width: "100%", height: "100%", xlinkHref: "#ray" + this.props.id }),
                    React.createElement("use", { id: "ray6", transform: "rotate(72 57.238 119.35)", width: "100%", height: "100%", xlinkHref: "#ray" + this.props.id }),
                    React.createElement("use", { id: "ray7", transform: "rotate(108 55.171 102.04)", width: "100%", height: "100%", xlinkHref: "#ray" + this.props.id })),
                React.createElement("circle", { className: "highlight", cx: "70.025", cy: "75.634", r: "2.0713", fill: "#f5f5f5", fillOpacity: ".87843" })));
    };
    Lightbulb.prototype.componentDidMount = function () {
        if (this.props.on) {
            this.switchOn();
        }
    };
    return Lightbulb;
}(React.Component));
exports.Lightbulb = Lightbulb;
//# sourceMappingURL=lightbulb.js.map