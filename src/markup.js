/*
    Adapt UI

    Copyright (C) LiveG. All Rights Reserved.

    https://liveg.tech
    Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.
*/

import * as $g from "./adaptui.js";
import * as aside from "./aside.js";
import * as menus from "./menus.js";
import * as screens from "./screens.js";
import * as dialogs from "./dialogs.js";
import * as dismiss from "./dismiss.js";
import * as screenScroll from "./screenscroll.js";

export function applyBackdrop(root = document) {
    root.querySelectorAll("aside, aui-menu").forEach(function(element) {
        if (!!element._aui_appliedBackdrop) {
            return;
        }

        element._aui_appliedBackdrop = true;

        var backdrop = document.createElement("aui-backdrop");
    
        backdrop.hidden = true;

        backdrop.setAttribute("aui-for", {
            "ASIDE": "aside", "AUI-MENU": "menu"
        }[element.tagName] || "");

        backdrop.addEventListener("click", function() {
            ({
                "ASIDE": aside.close,
                "AUI-MENU": menus.close
            }[element.tagName] || function() {})(element);
        });

        element.parentElement.insertBefore(backdrop, element);
    });
}

export function applyAsides(root = document) {
    root.querySelectorAll("aside").forEach(function(element) {
        if (!!element._aui_appliedAsides) {
            return;
        }

        element._aui_appliedAsides = true;

        element.addEventListener("keydown", function(event) {
            if (event.key == "Escape") {
                aside.close(element);
            }
        });

        aside.addPages(element);
    });
}

export function applyDialogs(root = document) {
    root.querySelectorAll("dialog").forEach(function(element) {
        if (!!element._aui_appliedDialogs) {
            return;
        }

        element._aui_appliedDialogs = true;

        dialogPolyfill.registerDialog(element);

        element.setAttribute("aui-mode", "hidden");

        element.addEventListener("keydown", function(event) {
            if (event.key == "Escape") {
                event.preventDefault();

                dialogs.close(element);
            }
        });
    });
}

export function applyCards(root = document) {
    root.querySelectorAll("aui-card").forEach(function(element) {
        if (!!element._aui_appliedCards) {
            return;
        }

        element._aui_appliedCards = true;

        var linkElements = element.querySelectorAll("a");

        if (linkElements.length > 0) {
            element.setAttribute("aui-linked", "");

            element.addEventListener("click", function() {
                linkElements[0].click();
            });
        }
    });
}

export function applyMenus(root = document) {
    root.querySelectorAll("aui-menu").forEach(function(element) {
        if (!!element._aui_appliedMenus) {
            return;
        }

        element._aui_appliedMenus = true;

        element.addEventListener("keydown", function(event) {
            if (event.key == "Escape") {
                event.preventDefault();

                menus.close(element);
            }
        });
    });

    root.querySelectorAll("aui-menu button").forEach(function(element) {
        if (!!element._aui_appliedMenus) {
            return;
        }

        if (element.hasAttribute("aui-bind") == "noClose") {
            return;
        }

        if (element.matches("aui-pagination button")) {
            return;
        }

        element._aui_appliedMenus = true;

        element.addEventListener("click", function() {
            menus.close(element.closest("aui-menu"));
        });
    });
}

export function applyDismissables(root = document) {
    root.querySelectorAll("[aui-dismissables]").forEach(function(element) {
        if (!!element._aui_appliedDismissables) {
            return;
        }

        element._aui_appliedDismissables = true;

        element.querySelectorAll(":scope > *").forEach(function(childElement) {
            dismiss.swipeToDismiss(childElement, {
                "up": dismiss.directions.UP,
                "down": dismiss.directions.DOWN,
                "left": dismiss.directions.LEFT,
                "right": dismiss.directions.RIGHT,
                "start": dismiss.directions.START,
                "end": dismiss.directions.END,
                "vertical": dismiss.directions.VERTICAL,
                "horizontal": dismiss.directions.HORIZONTAL,
            }[element.getAttribute("aui-dismissdir")] || undefined);
        });
    });
}

export function applyScrollableScreens(root = document) {
    root.querySelectorAll("aui-screenscroll").forEach(function(element) {
        var scrollable = new screenScroll.ScrollableScreen($g.sel(element));

        if (element.getAttribute("aui-mode") == "paginated") {
            var paginator = document.createElement("aui-pagination");

            paginator.setAttribute("aria-role", "group");

            scrollable.applyPagination($g.sel(paginator));

            element.parentElement.insertBefore(paginator, element.nextSibling);
        }
    });
}

export function applyBindings(root = document) {
    root.querySelectorAll("[aui-bind]").forEach(function(element) {
        if (!!element._aui_appliedBindings) {
            return;
        }

        element._aui_appliedBindings = true;

        var binding = element.getAttribute("aui-bind").toLowerCase();
        var action = function() {};

        switch (binding) {
            case "aside":
                action = () => element.closest("aui-screen").querySelectorAll("aside").forEach(aside.toggle);
                break;

            case "back":
                action = () => screens.navigateBack();
                break;

            case "close":
                action = () => dialogs.close(element.closest("dialog"));
                break;
        }

        element.addEventListener("click", function() {
            action();
        });
    });
}

export function apply(root = document) {
    applyBackdrop(root);
    applyAsides(root);
    applyDialogs(root);
    applyCards(root);
    applyMenus(root);
    applyDismissables(root);
    applyScrollableScreens(root);
    applyBindings(root);
}