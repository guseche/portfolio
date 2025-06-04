const rutas = {
    '/home': 'src/pages/home.html',
    '/about': 'src/pages/about.html',
    '/projects': 'src/pages/projects.html',
    '/contact': 'src/pages/contact.html',
};



async function cargarRuta() {
    const hash = location.hash.slice(1) || '/home';
    const archivo = rutas[hash];
    const contenedor = document.getElementById('content');
       
    if (!archivo) {
        contenedor.innerHTML = '<h1>404 - Página no encontrada</h1>';
        return;
    }

    try {
        const res = await fetch(archivo);
        const html = await res.text();
        contenedor.innerHTML = html;

        contenedor.querySelectorAll('script').forEach(s => {
            const script = document.createElement('script');
            
            if(s?.src){
                script.src = s.src;
                script.async = false;
                document.body.appendChild(script);
            }
            
        });

    } catch {
        contenedor.innerHTML = '<h1>Error al cargar</h1>';
    }
}

window.addEventListener('hashchange', cargarRuta);
window.addEventListener('load', cargarRuta);

document.addEventListener('DOMContentLoaded', function () {

    

    const toggleButton = document.getElementById('toggle-menu');
    if (toggleButton) {
        toggleButton.addEventListener('click', function () {
            const menu = document.getElementById('nav-menu');
            menu.classList.toggle('active');
        });
    }

});