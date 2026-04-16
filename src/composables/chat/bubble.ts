import { startRecording, stopRecording } from "./record";

let recording = false;

class Bubble {
    startX = 0;
    startY = 0;
    animationId = 0;
    radius = 50;
}

let currentBubble = new Bubble();
const maxRadius = 180;
let clientX = 0;
let clientY = 0;

export async function blowBubble(e: MouseEvent) {
    const canvas = e.target as HTMLCanvasElement;
    if(!canvas) return;

    const rect = canvas.getBoundingClientRect();
    clientX = e.clientX - rect.left;
    clientY = e.clientY - rect.top;

    currentBubble.startX = clientX;
    currentBubble.startY = clientY;

    const ctx = canvas.getContext('2d');
    if(!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 0;

    increaseBubbleSize(ctx);
    if(!recording) {
        await startRecording();
        recording = true;
    }
}

export function stopBlowingBubble() {
    cancelAnimationFrame(currentBubble.animationId);
    currentBubble = new Bubble();
    clientX = 0;
    clientY = 0;

    stopRecording();
    recording = false;
}

function increaseBubbleSize(ctx: CanvasRenderingContext2D) {
    const x = clientX;
    const y = clientY;
    const radius = currentBubble.radius;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.clip();

    const body = ctx.createRadialGradient(x - radius * 0.08, y - radius * 0.12, radius * 0.1, x, y, radius);
    body.addColorStop(0, 'rgba(224, 248, 255, 0.55)');
    body.addColorStop(0.35, 'rgba(168, 232, 248, 0.3)');
    body.addColorStop(1, 'rgba(80, 168, 224, 0.35)');
    ctx.fillStyle = body;
    ctx.fill();

    const iris = ctx.createRadialGradient(x + radius * 0.15, y + radius * 0.1, 0, x, y, radius);
    iris.addColorStop(0, 'rgba(232, 176, 255, 0.55)');
    iris.addColorStop(0.4, 'rgba(128, 216, 255, 0.45)');
    iris.addColorStop(0.7, 'rgba(176, 255, 204, 0.35)');
    iris.addColorStop(1, 'rgba(255, 224, 128, 0.25)');
    ctx.fillStyle = iris;
    ctx.fill();

    ctx.restore();

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    const edge = ctx.createRadialGradient(x, y, radius * 0.84, x, y, radius);
    edge.addColorStop(0, 'rgba(160, 216, 255, 0)');
    edge.addColorStop(0.5, 'rgba(160, 216, 255, 0.5)');
    edge.addColorStop(0.78, 'rgba(208, 168, 255, 0.75)');
    edge.addColorStop(0.9, 'rgba(128, 240, 216, 0.6)');
    edge.addColorStop(1, 'rgba(255, 255, 255, 0.5)');
    ctx.fillStyle = edge;
    ctx.fill();

    const shine = ctx.createRadialGradient(x - radius * 0.2, y - radius * 0.28, 0, x - radius * 0.1, y - radius * 0.1, radius * 0.45);
    shine.addColorStop(0, 'rgba(255, 255, 255, 1)');
    shine.addColorStop(0.45, 'rgba(232, 248, 255, 0.7)');
    shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    if(radius < maxRadius) {
        currentBubble.radius += 0.2;
        currentBubble.animationId = requestAnimationFrame(() => increaseBubbleSize(ctx));
    } else stopBlowingBubble();
}