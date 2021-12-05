import domready from "domready"
import "./style.css"
import Color from "./Color";
import weightedRandom from "./weightedRandom";


const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0
};

/**
 * @type CanvasRenderingContext2D
 */
let ctx;
let canvas;

function sqRnd()
{
    const rnd = Math.random();
    return rnd * rnd * rnd * rnd;
}

function norm(number)
{
    const n = number - (number | 0);
    return n < 0 ? 1 + n : n;
}

const harmonies = [
    0,
    1/6,
    1/3,
    0.5,
    2/3,
    5/6
]


const blue = Color.from("#009dff")


domready(
    () => {

        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        const width = (window.innerWidth) | 0;
        const height = (window.innerHeight) | 0;

        config.width = width;
        config.height = height;

        canvas.width = width;
        canvas.height = height;

        const paint = () => {

            const hue = Math.random();


            function randomColor(flag = 0, alpha = 0.9)
            {
                return Color.fromHSL(
                    norm(hue + harmonies[0|Math.random() * harmonies.length]),
                    0.25 + 0.75 * Math.random(),
                    flag === 0 ? Math.random() : flag < 0 ? 0.3 : 0.65
                )
            }


            const createRandomGradient = (flag) => {
                const { width, height } = config;
                const size = Math.max(width, height);

                const corner = 0| Math.random() * 4;

                let x,y;

                switch(corner)
                {
                    case 0:
                        x = 0;
                        y = 0;
                        break;
                    case 1:
                        x = width;
                        y = 0;
                        break;
                    case 2:
                        x = 0;
                        y = height;
                        break;
                    case 3:
                        x = width;
                        y = height;
                        break;
                }


                const gradient = ctx.createRadialGradient(x, x, size, x, y, 0)
                gradient.addColorStop(
                    0,
                    randomColor(flag).toRGBA(0.9)
                )
                gradient.addColorStop(
                    1,
                    randomColor(-flag).toRGBA(0.9)
                )

                return gradient
            };

            const setClip = () => {
                ctx.beginPath();
                for (let i = lineWidth; i < size + height; i += lineWidth * (1 + Math.floor(sqRnd() * 7)))
                {
                    ctx.moveTo(i, 0);
                    ctx.lineTo(i - lineWidth, 0);
                    ctx.lineTo(i - lineWidth - height, height);
                    ctx.lineTo(i - height, height);
                    ctx.lineTo(i, 0);
                }
                ctx.clip();
            };

            const shapes = weightedRandom([
                1, () => {
                    const x0 = 0| Math.random() * width
                    const y0 = 0| Math.random() * height
                    const x1 = x0
                    const y1 = 0| Math.random() * height

                    ctx.lineWidth = 4 + Math.random() * 10
                    ctx.strokeStyle = randomColor(0).toRGBA(0.9);
                    ctx.beginPath()
                    ctx.moveTo(x0, y0)
                    ctx.lineTo(x1, y1)
                    ctx.stroke()
                },
                1, () => {
                    const x0 = 0| Math.random() * width
                    const y0 = 0| Math.random() * height
                    const x1 = 0| Math.random() * width
                    const y1 = y0

                    ctx.lineWidth = 4 + Math.random() * 10
                    ctx.strokeStyle = randomColor(0).toRGBA(0.9);
                    ctx.beginPath()
                    ctx.moveTo(x0, y0)
                    ctx.lineTo(x1, y1)
                    ctx.stroke()
                },
                3, () => {
                    const size = Math.max(width, height) / 8;
                    const radius = 0 | (size * Math.random());

                    const x0 = 0| Math.random() * (width - size)
                    const y0 = 0| Math.random() * (height - size)

                    ctx.fillStyle = randomColor(0).toRGBA(0.8);
                    ctx.beginPath()
                    ctx.arc(x0,y0, radius, 0, TAU, true)
                    ctx.fill()
                },
                1, () => {
                    const size = Math.max(width, height) / 5;
                    const w = 0|(size * Math.random());
                    const h = 0|(size * Math.random());

                    const x0 = 0| Math.random() * (width - size/2)
                    const y0 = 0| Math.random() * (height - size/2)

                    ctx.fillStyle = randomColor(0).toRGBA(0.8);
                    ctx.fillRect(x0,y0,w,h);
                },
            ])

            const randomShapes = () => {

                const num = (8 + Math.random() * 8)|0
                for (let i = 0; i < num; i++)
                {
                    shapes();
                }
            };

            let size = Math.max(width, height);
            ctx.fillStyle = createRandomGradient(-1);
            ctx.fillRect(0, 0, width, height);

            const lineWidth = 9;

            ctx.save()

            randomShapes()

            setClip();

            ctx.fillStyle = createRandomGradient(1);
            ctx.fillRect(0, 0, width, height);


            randomShapes()
            ctx.restore()

            const tint = ctx.createLinearGradient(width/2, 0, width/2, height);
            const c0 = randomColor(0,0.1);
            const c1 = randomColor(0,0.3);
            tint.addColorStop(0,c0.toRGBA(0))
            tint.addColorStop(0.5,c0.mix(c1, 0.25).toRGBA(0.05))
            tint.addColorStop(1,c1.toRGBA(0.4))
            ctx.fillStyle = tint;
            ctx.fillRect(0, 0, width, height);


        }


        paint()

        window.addEventListener("click", paint, true)


    }
);
