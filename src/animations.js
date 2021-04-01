/*
    LiveG App Runtime

    Copyright (C) LiveG. All Rights Reserved.

    https://liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

// Domain:  t >= 0 && t <= 1
// Range:   f(t) >= 0 && f(t) <= 1
export const easingFunctions = {
    LINEAR: (t) => t,
    EASE: (t) => t < 0.5 ? 2 * Math.pow(t, 2) : -1 + ((4 - (2 * t)) * t),
    EASE_IN: (t) => Math.pow(t, 2),
    EASE_OUT: (t) => t * (2 - t)
};

export function getStyleNumericalValue(element, property) {
    return parseFloat(getComputedStyle(element)[property]) || 0;
}

export function getStyleUnit(element, property) {
    return /[0-9]*(.*)/.exec(getComputedStyle(element)[property])[1];
}

export function easeStyleTransition(element, property, targetValue, duration = 500, easingFunction = easingFunctions.EASE) {
    var startTime = new Date().getTime();
        var initialValue = getStyleNumericalValue(element, property);
        var styleUnit = getStyleUnit(element, property);

    return new Promise(function(resolve, reject) {
        requestAnimationFrame(function renderFrame() {
            var currentDuration = new Date().getTime() - startTime;
            var currentEasePosition = easingFunction(Math.min(currentDuration / duration, 1));
    
            element.style[property] = String(initialValue + (currentEasePosition * (targetValue - initialValue))) + styleUnit;
    
            if (currentEasePosition < 1) {
                requestAnimationFrame(renderFrame);
            } else {
                resolve();
            }
        });
    });
}

export function fadeIn(element, duration = 500) {
    element.hidden = false;

    return easeStyleTransition(element, "opacity", "1", duration);
}

export function fadeOut(element, duration = 1000) {
    return easeStyleTransition(element, "opacity", "0", duration).then(function() {
        element.hidden = true;

        return Promise.resolve();
    });
}