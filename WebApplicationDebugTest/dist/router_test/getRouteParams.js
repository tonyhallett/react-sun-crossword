"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PatternUtils_1 = require("./PatternUtils");
/**
 * Extracts an object of params the given route cares about from
 * the given params object.
 */
function getRouteParams(route, params) {
    var routeParams = {};
    if (!route.path)
        return routeParams;
    PatternUtils_1.getParamNames(route.path).forEach(function (p) {
        if (Object.prototype.hasOwnProperty.call(params, p)) {
            routeParams[p] = params[p];
        }
    });
    return routeParams;
}
exports.default = getRouteParams;
//# sourceMappingURL=getRouteParams.js.map