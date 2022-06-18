kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
})
const SPEED = 340
const ENEMY_SPEED = 160
const BULLET_SPEED = 800
loadSprite("tubewidth", "Images/tubewidth.png");
loadSprite("tubeheight", "Images/tubeheight.png");
loadSprite("background", "Images/Background.png");
loadSprite("nn", "Images/nn.png");
loadSprite("cicle", "Images/circle.png");
loadSprite("cicle1", "Images/cicle.png");
loadSprite("cicle2", "Images/cc.png");
loadSprite("ghosty", "Images/ghosty.png");
loadSound("bell", "https://kaboomjs.com/sounds/bell.mp3")
loadSound("score", "https://kaboomjs.com/sounds/score.mp3")
loadSound("a","https://kaboomjs.com/sounds/wooosh.mp3")
var game = "start";
function addButton(txt, p, f) {

    const btn = add([
        text(txt),
        pos(p),
        area({ cursor: "pointer", }),
        scale(1),
        origin("center"),
    ])

    btn.onClick(f)

    btn.onUpdate(() => {
        if (btn.isHovering()) {
            const t = time() * 10
            btn.color = rgb(
                wave(0, 255, t),
                wave(0, 255, t + 2),
                wave(0, 255, t + 4),
            )
            btn.scale = vec2(1.2)
        } else {
            btn.scale = vec2(1)
            btn.color = rgb()
        }
    })

}
scene("over", () => {
    addButton("OVER", vec2(center()), () => go(game))
})
scene("start", () => {
    addButton("START", vec2(center()), () => go("game"))
})
var sc = 0;
speed = 320;
var max = 10;

scene("game", () => {
    game = "game";
    add([
        sprite("background"),
        pos(0, 0),
    ])
    add([
        sprite("cicle2"),
        pos(390, 13),
    ])
    const t1 = add([
        sprite("tubewidth"),
        pos(100, 70),
        area(),
        solid(),
        "t1"
    ])
    const t2 = add([
        sprite("tubewidth"),
        pos(100, 580),
        area(),
        solid(),
        "t2"
    ])
    const t3 = add([
        sprite("tubeheight"),
        pos(100, 70),
        area(),
        solid(),
        "t3"
    ])
    const t4 = add([
        sprite("tubeheight"),
        pos(1050, 70),
        area(),
        solid(),
        "t4"
    ])
    const ball = add([
        sprite("cicle2"),
        pos(center()),
        origin("center"),
        area({ width: 32, height: 32, offset: vec2(-16) }),
        { vel: dir(rand(-20, 20)) },
        "ball"
    ])
    ball.onCollide("t1", (p) => {
        ball.vel.y = -ball.vel.y
        speed += 5
    })
    ball.onCollide("t2", (p) => {
        ball.vel.y = -ball.vel.y
        speed += 5
    })
    ball.onCollide("t3", (p) => {
        ball.vel.x = -ball.vel.x
        speed += 5
    })
    ball.onCollide("t4", (p) => {
        ball.vel.x = -ball.vel.x
        speed += 5
    })
    const player = add([
        sprite("cicle"),
        pos(400, 400),
        area(),
        solid(),
        origin("center"),
    ])
    const enemy = add([
        sprite("ghosty"),
        pos(800, 500),
        origin("center"),
        area(),
        state("move", ["idle", "attack", "move",]),
    ])

    ball.onUpdate(() => {
        ball.move(ball.vel.scale(speed))
    })
    enemy.onStateEnter("idle", async () => {
        await wait(0.5)
        enemy.enterState("attack")
    })
    label = add([
        text("Colect  :" + sc + "/" + max),
        pos(100, 5),
    ])
    player.onCollide("ball", () => {
        play("bell")
        sc++;
        label.onUpdate(() => {
            label.text = "Colect  :" + sc + "/" + max
        })
    });
    enemy.onStateEnter("attack", async () => {
        if (sc < max) {

            const dir = player.pos.sub(enemy.pos).unit()

            const bu = add([
                pos(enemy.pos),
                move(dir, BULLET_SPEED),
                sprite("cicle1"),
                area(),
                cleanup(),
                solid(),
                origin("center"),
                "bullet",
            ])
            play("score");
        }

        await wait(1)

        enemy.enterState("move")

    })
    enemy.onStateEnter("move", async () => {
        await wait(2)
        enemy.enterState("idle")
    })

    enemy.onStateUpdate("move", () => {
        if (!player.exists()) return
        const dir = player.pos.sub(enemy.pos).unit()
        enemy.move(dir.scale(ENEMY_SPEED))
    })

    enemy.enterState("move")

    player.onCollide("bullet", (bullet) => {
        burp()
        destroy(bullet)
        destroy(player)
        addKaboom(bullet.pos)
        wait(1.5, () => go("over"))
    })
    t1.onCollide("bullet", (bullet) => {
        destroy(bullet)
    })
    t2.onCollide("bullet", (bullet) => {
        destroy(bullet)
    })

    t3.onCollide("bullet", (bullet) => {
        destroy(bullet)
    })

    t4.onCollide("bullet", (bullet) => {
        destroy(bullet)
    })
    enemy.onUpdate(() => {
        if (sc >= max) {
            destroy(enemy);
            destroy(label);
            destroy(player);
            go("game1")
        }
    })

    onKeyDown("left", () => {
        player.move(-SPEED, 0)
    })

    onKeyDown("right", () => {
        player.move(SPEED, 0)
    })

    onKeyDown("up", () => {
        player.move(0, -SPEED)
    })

    onKeyDown("down", () => {
        player.move(0, SPEED)
    })

});
scene("game2", () => {
    speed = 320;
    game = "game2";
    add([
        sprite("background"),
        pos(0, 0),
    ])
    const t1 = add([
        sprite("tubewidth"),
        pos(100, 70),
        area(),
        solid(),
        "t1"
    ])
    const t2 = add([
        sprite("tubewidth"),
        pos(100, 580),
        area(),
        solid(),
        "t2"
    ])
    add([
        pos(90, 0),
        sprite("nn"),
        origin("right"),
        area(),
        origin("center"),
        "paddle",
    ])

    add([
        pos(1110, 0),
        sprite("nn"),
        origin("center"),
        area(),
        "paddle",
    ])
    const ball = add([
        sprite("cicle"),
        pos(center()),
        origin("center"),
        area({ width: 32, height: 32, offset: vec2(-16) }),
        { vel: dir(rand(-180, 180)) },
        "ball"
    ])
    ball.onCollide("t1", (p) => {
        ball.vel.y = -ball.vel.y
        speed += 1
        play("a")
    })
    ball.onCollide("t2", (p) => {
        ball.vel.y = -ball.vel.y
        speed += 1
        play("a")
    })
    onUpdate("paddle", (p) => {
        p.pos.y = mousePos().y
        
    })
    ball.onUpdate(() => {
        ball.move(ball.vel.scale(speed))
        if (ball.pos.x < 50 || ball.pos.x > 1200)
        go("over");
    })
    ball.onCollide("paddle", (p) => {
        ball.vel = dir(ball.pos.angle(p.pos))
        speed += 20
        play("bell")
    })


})
const trail = []
const outline = {
    width: 3,
    color: rgb(255, 0, 0),
}
const t = (n = 1) => time() * n
const w = (a, b, n) => wave(a, b, t(n))
const px = 160
const py = 200
const doodles = []
var check = true;
scene("game1", () => {
    game = "game1";
    add([
        sprite("background"),
        pos(0, 0),
    ])
    const t1 = add([
        sprite("tubewidth"),
        pos(100, 70),
        area(),
        solid(),
        "t1"
    ])
    const t2 = add([
        sprite("tubewidth"),
        pos(100, 580),
        area(),
        solid(),
        "t2"
    ])
    const t3 = add([
        sprite("tubeheight"),
        pos(100, 70),
        area(),
        solid(),
        "t3"
    ])
    const t4 = add([
        sprite("tubeheight"),
        pos(1050, 70),
        area(),
        solid(),
        "t4"
    ])
    for (let i = 0; i < 30; i++) {
        
        const ball = add([
            sprite("cicle2"),
            pos(center()),
            origin("center"),
            area({ width: 32, height: 32, offset: vec2(-16) }),
            { vel: dir(rand(-180, 180)) },
            "ball"
        ])
        ball.onCollide("t1", (p) => {
            ball.vel.y = -ball.vel.y
            if (speed < 2000){
                speed += 5
            }
        })
        ball.onCollide("t2", (p) => {
            ball.vel.y = -ball.vel.y
            if (speed < 2000){
                speed += 5
            }
        })
        ball.onCollide("t3", (p) => {
            ball.vel.x = -ball.vel.x
            if (speed < 2000){
                speed += 5
            }
            
        })
        ball.onCollide("t4", (p) => {
            ball.vel.x = -ball.vel.x
            if (speed < 2000){
                speed += 5
            }
            
        })
        ball.onUpdate(() => {
            ball.move(ball.vel.scale(speed))
        })
        onUpdate(() => {
            if (Math.abs(mousePos().x - ball.pos.x) < 20 && Math.abs(mousePos().y - ball.pos.y) < 20) {
                destroy(ball)
                play("bell")
            }
        })
        
        
    }
    let time = 30
    label = add([
        text("Destroy all   "),
        pos(100, 5),
    ])
    label.onUpdate(() =>{
        label.text = "Destroy all   ";  
    })
	const timer = add([
		origin("topright"),
		pos(width() - 24, 24),
		text(time),
	])
    onUpdate(() => {
        if (time > 0)
		    time -= dt()
        timer.text = time.toFixed(2)
        if (time <= 0 && get("ball").length > 0){
            go("over")
        }
        if (get("ball").length <= 0){
            wait(1.5, () => go("game2"))
        }
	})
    onDraw(() => {

        const mx = (width() - px * 2) / 2
        const my = (height() - py * 2) / 1
        const p = (x, y) => vec2(x, y).scale(mx, my).add(px, py)
        drawLines({
            ...outline,
            pts: trail,
        })


    })
    onUpdate(() => {

        trail.push(mousePos())

        if (trail.length > 16) {
            trail.shift()
        }
    })
    

})
go(game)