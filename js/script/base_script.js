"use strict";
const sidebarEl = document.querySelector('.sidebar-nav');
const menuEl = document.querySelector('#menu-toggle-btn');
const contentContainerEl = document.querySelector('.content-container');
const sidebarNavItemElList = document.querySelectorAll('.sidebar-nav-links>.nav-item');
function setSidebarStatus() {
    if (window.innerWidth < 768) {
        contentContainerEl === null || contentContainerEl === void 0 ? void 0 : contentContainerEl.classList.remove('content-container--reduced');
        sidebarEl === null || sidebarEl === void 0 ? void 0 : sidebarEl.classList.remove('sidebar--extended');
    }
    else {
        contentContainerEl === null || contentContainerEl === void 0 ? void 0 : contentContainerEl.classList.add('content-container--reduced');
        sidebarEl === null || sidebarEl === void 0 ? void 0 : sidebarEl.classList.add('sidebar--extended');
    }
}
menuEl === null || menuEl === void 0 ? void 0 : menuEl.addEventListener('click', () => {
    contentContainerEl === null || contentContainerEl === void 0 ? void 0 : contentContainerEl.classList.toggle('content-container--reduced');
    sidebarEl === null || sidebarEl === void 0 ? void 0 : sidebarEl.classList.toggle('sidebar--extended');
});
sidebarNavItemElList.forEach((el) => {
    const child = el.querySelector('a');
    child === null || child === void 0 ? void 0 : child.addEventListener('click', () => {
        el.classList.toggle('sidebar-nav-links--extended');
    });
});
window.addEventListener('resize', () => {
    setSidebarStatus();
});
window.addEventListener('DOMContentLoaded', () => {
    setSidebarStatus();
});
window.addEventListener('load', () => {
    var _a;
    (_a = document.querySelector('.loading')) === null || _a === void 0 ? void 0 : _a.classList.add('loading--finish');
});
//# sourceMappingURL=base_script.js.map