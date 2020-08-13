const sidebarEl: HTMLElement | null = document.querySelector('.sidebar-nav');
const menuEl: HTMLElement | null = document.querySelector('#menu-toggle-btn');
const contentContainerEl: HTMLElement | null = document.querySelector('.content-container');
const sidebarNavItemElList: NodeListOf<HTMLElement> = document.querySelectorAll('.sidebar-nav-links>.nav-item');

menuEl?.addEventListener('click', (): void => {
    contentContainerEl?.classList.toggle('content-container--reduced');
    sidebarEl?.classList.toggle('sidebar--extended');
});

sidebarNavItemElList.forEach((el: HTMLElement): void => {
    const child: HTMLElement | null = el.querySelector('a');
    
    child?.addEventListener('click', (): void => {
        el.classList.toggle('sidebar-nav-links--extended')
    });
})

window.addEventListener('resize', (): void => {
    if (window.innerWidth < 768) {
        contentContainerEl?.classList.remove('content-container--reduced');
        sidebarEl?.classList.remove('sidebar--extended');
    } else {
        contentContainerEl?.classList.add('content-container--reduced');
        sidebarEl?.classList.add('sidebar--extended');
    }
});