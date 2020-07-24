const sidebarEl: HTMLElement | null = document.querySelector(".sidebar-nav");
const menuEl: HTMLElement | null = document.querySelector("#menu-toggle-btn");

let isClosed: boolean = true;

if (menuEl) {
    menuEl.addEventListener("click", (): void => {
        if (sidebarEl) {
            if (window.innerWidth > 768) {
                if (isClosed) {
                    sidebarEl.style.width = "350px";
                    isClosed = false;
                } else {
                    sidebarEl.style.width = "0px";
                    isClosed = true;
                }
            } else {
                if (isClosed) {
                    sidebarEl.style.left = "0";
                    isClosed = false;
                } else {
                    sidebarEl.style.left = "-100vw";
                    isClosed = true;
                }
            }
        }
    })
}

window.addEventListener('resize', (): void => {
    if (sidebarEl) {
        if (window.innerWidth > 768) {
            if (isClosed) {
                sidebarEl.style.width = "0px";
            } else {
                sidebarEl.style.width = "350px";
            }
        } else {
            sidebarEl.style.width = "100vw";
            if (isClosed) {
                sidebarEl.style.left = "-100vw";
            } else {
                sidebarEl.style.left = "0";
            }
        }
    }
})