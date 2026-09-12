document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('navbarToggle');
    const menu = document.getElementById('navbarMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    menu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        });
    });

    document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
});
