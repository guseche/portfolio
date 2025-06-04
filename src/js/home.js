console.log('home.js');

function create() {

    const { Engine, Render, Runner, Bodies, Composite, Events, Mouse, MouseConstraint } = Matter;
    const engine = Engine.create();
    const world = engine.world;

    const isSmallScreen = window.innerWidth < 850;

    const myBody = Bodies.rectangle(200, 200, 50, 50, {
        isStatic: isSmallScreen // Será estático solo si la pantalla es menor a 850px
    });

    // Escuchar cambios de tamaño de pantalla
    window.addEventListener("resize", () => {
        const shouldBeStatic = window.innerWidth < 850;
        Body.setStatic(myBody, shouldBeStatic);
    });

    const render = Render.create({
        element: document.getElementById('skillsCanvas').parentElement,
        canvas: document.getElementById('skillsCanvas'),
        engine: engine,
        options: {
            width: document.querySelector('.div5').clientWidth,
            height: document.querySelector('.div5').clientHeight,
            wireframes: false,
            background: 'transparent',
        }
    });

    Render.run(render);
    Runner.run(Runner.create(), engine);

    const skills = [
        'Testing', 'Communication', 'Teamwork', 'Problem-solving', 'Adaptability',
        'Critical Thinking', 'Attention to Detail', 'Continuous Learning',
        'Collaboration', 'Creativity', 'Agile Methodologies', 'Version Control'
    ];

    skills.forEach((skill, index) => {
        const x = Math.random() * (render.options.width - 100) + 50;
        const y = Math.random() * (render.options.height - 40) + 20;
        let skillBody = Bodies.rectangle(x, y, render.options.width * 0.3, 30, {
            restitution: 0.001,  // Rebote alto para evitar que atraviese objetos
            frictionAir: 0.3,  // Reduce la aceleración extrema en el aire
            collisionFilter: { group: 1 }, // Filtra mejor las colisiones
            render: {
                fillStyle: '#f8f8f8',
                strokeStyle: '#000',
                lineWidth: 1
            },
            chamfer: {
                radius: 10
            }
        });

        Composite.add(world, skillBody);

        Events.on(render, "afterRender", function (event) {
            const ctx = render.context;
            const { position, angle } = skillBody;

            ctx.save();
            ctx.translate(position.x, position.y);
            ctx.rotate(angle);
            ctx.fillStyle = "black";
            ctx.font = "40 Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(skill, 0, 0);
            ctx.restore();
        });

        let skillBody1 = Bodies.circle(x, y, 40, {
            restitution: 0.1,  // Rebote alto para evitar que atraviese objetos
            frictionAir: 0.3,  // Reduce la aceleración extrema en el aire
            collisionFilter: { group: 0 }, // Filtra mejor las colisiones
            density: 0.001,
            render: {
                sprite: {
                    texture: './assets/images/bug.svg'
                }
            }
        })

        Composite.add(world, skillBody1);
    });

    const walls = [
        // Pared superior
        Bodies.rectangle(render.options.width / 2, 0, render.options.width, 10, { isStatic: true, render: { visible: false } }),
        // Pared inferior
        Bodies.rectangle(render.options.width / 2, render.options.height, render.options.width, 10, { isStatic: true, render: { visible: false } }),
        // Pared izquierda
        Bodies.rectangle(0, render.options.height / 2, 10, render.options.height, { isStatic: true, render: { visible: false } }),
        // Pared derecha
        Bodies.rectangle(render.options.width, render.options.height / 2, 10, render.options.height, { isStatic: true, render: { visible: false } })
    ];

    Composite.add(world, walls);

}

function checkMobile() {
    create();
}

window.addEventListener('resize', checkMobile);
create();