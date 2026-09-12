// =====================================================
// NAVBAR - MENÚ HAMBURGUESA
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('navbarToggle');
    const menu = document.getElementById('navbarMenu');

    // Si no existe el toggle, no hacer nada (por si no está en esa página)
    if (!toggle || !menu) return;

    // Abrir/cerrar menú
    toggle.addEventListener('click', function() {
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    const links = menu.querySelectorAll('a');
    links.forEach(function(link) {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        });
    });

    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('active');
            toggle.classList.remove('active');
        }
    });
});
