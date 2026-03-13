let angleSlider;
let n1 = 1.0; // Air
let n2 = 1.5; // Glass
let time = 0;

function setup() {
  // This automatically centers the simulation on your screen
  let cnv = createCanvas(windowWidth > 800 ? 800 : windowWidth - 20, 500);
  cnv.style('display', 'block');
  cnv.style('margin', '20px auto');
  
  // Create the slider and center it below the canvas
  angleSlider = createSlider(0, 89, 45);
  angleSlider.style('width', '300px');
  angleSlider.style('display', 'block');
  angleSlider.style('margin', '0 auto');
}

function windowResized() {
  resizeCanvas(windowWidth > 800 ? 800 : windowWidth - 20, 500);
}

function draw() {
  background(255);
  let thetaI_deg = angleSlider.value();
  let thetaI = radians(thetaI_deg);
  
  // Snell's Law and Fresnel Math
  let thetaT = asin((n1 * sin(thetaI)) / n2);
  let brewster_deg = degrees(atan(n2 / n1));
  let intensity = pow(tan(thetaI - thetaT) / tan(thetaI + thetaT), 2);
  
  // 1. Draw Main Simulation & Waves
  drawSimulation(thetaI, thetaT, intensity);
  
  // 2. Draw Real-Time Intensity Graph
  drawGraph(thetaI_deg, intensity);
  
  // Data Text Labels
  fill(50); noStroke(); textSize(16); textStyle(BOLD);
  text(`Incident Angle: ${thetaI_deg}°`, 20, 40);
  fill(0, 102, 204);
  text(`Brewster Angle: ${brewster_deg.toFixed(1)}°`, 20, 65);
  fill(255, 0, 0);
  text(`Reflected Intensity: ${(intensity * 100).toFixed(2)}%`, 20, 90);
  
  time += 0.2; 
}

function drawSimulation(ti, tt, intens) {
  let cx = width / 2 - 100; 
  let cy = 300;
  
  // The Glass Medium
  fill(235, 245, 255); noStroke();
  rect(0, cy, width, height - cy);
  
  // Normal line (Dashed)
  stroke(180); drawingContext.setLineDash([5, 5]);
  line(cx, 100, cx, 500); drawingContext.setLineDash([]);
  
  // Incident Wave (Red)
  drawWaveRay(cx, cy, ti, 250, color(255, 0, 0), 1.0, true);
  // Refracted Wave (Light Red)
  drawWaveRay(cx, cy, tt, 200, color(255, 100, 100), 0.8, false);
  // Reflected Wave (Fades out at Brewster's Angle!)
  drawWaveRay(cx, cy, -ti, 250, color(255, 0, 0, intens * 255), intens, false);
}

function drawWaveRay(x, y, angle, len, col, amp, isIncoming) {
  stroke(col); strokeWeight(3);
  let dir = isIncoming ? -1 : 1;
  for (let i = 0; i < len; i += 5) {
    let d = i * dir;
    let px = x + d * sin(angle);
    let py = y - d * cos(angle);
    let wave = sin(i * 0.15 - time) * (20 * amp);
    let wx = px + wave * cos(angle);
    let wy = py + wave * sin(angle);
    point(wx, wy);
  }
}

function drawGraph(currentAngle, currentIntens) {
  let gx = width - 180; let gy = 150; let gw = 150; let gh = 100;
  stroke(0); strokeWeight(1);
  line(gx, gy, gx + gw, gy); line(gx, gy, gx, gy - gh);
  
  noFill(); stroke(0, 100, 255, 150);
  beginShape();
  for (let a = 0; a < 90; a++) {
    let r_a = radians(a);
    let r_t = asin((n1 * sin(r_a)) / n2);
    let r_intens = pow(tan(r_a - r_t) / tan(r_a + r_t), 2);
    vertex(gx + (a / 90) * gw, gy - r_intens * gh);
  }
  endShape();
  
  fill(255, 0, 0); noStroke();
  ellipse(gx + (currentAngle / 90) * gw, gy - currentIntens * gh, 8, 8);
  fill(0); textSize(10); text("0°", gx, gy + 15); text("90°", gx + gw - 15, gy + 15);
  text("Reflectance Curve", gx, gy - gh - 10);
}
