let angleSlider;
let n1 = 1.0; // Air
let n2 = 1.5; // Glass
let time = 0;

function setup() {
  let cnv = createCanvas(800, 500); // Made it slightly wider for the graph
  cnv.parent('slider-container');
  cnv.style('display', 'block');
  cnv.style('margin', 'auto');
  
  angleSlider = createSlider(0, 89, 45);
  angleSlider.style('width', '400px');
}

function draw() {
  background(255);
  let thetaI_deg = angleSlider.value();
  let thetaI = radians(thetaI_deg);
  
  let thetaT = asin((n1 * sin(thetaI)) / n2);
  let brewster_deg = degrees(atan(n2 / n1));
  let intensity = pow(tan(thetaI - thetaT) / tan(thetaI + thetaT), 2);
  
  // 1. Draw Main Simulation & Waves
  drawSimulation(thetaI, thetaT, intensity);
  
  // 2. Draw Real-Time Intensity Graph
  drawGraph(thetaI_deg, intensity);
  
  // Update labels
  fill(0); noStroke(); textSize(14);
  text(`Incident Angle: ${thetaI_deg}°`, 20, height - 60);
  text(`Brewster Angle: ${brewster_deg.toFixed(1)}°`, 20, height - 40);
  text(`Reflected Intensity: ${(intensity * 100).toFixed(2)}%`, 20, height - 20);
  
  time += 0.2; // Speed of the wave animation
}

function drawSimulation(ti, tt, intens) {
  let cx = 300; // Shifted left to make room for graph
  let cy = 250;
  
  // Glass Medium
  fill(230, 245, 255); noStroke();
  rect(0, cy, 600, height - cy);
  
  // Normal line
  stroke(200); drawingContext.setLineDash([5, 5]);
  line(cx, 50, cx, 450); drawingContext.setLineDash([]);
  
  // RAYS & WAVES
  // Incident Ray
  drawWaveRay(cx, cy, ti, 200, color(255, 0, 0), 1.0, true);
  // Refracted Ray
  drawWaveRay(cx, cy, tt, 200, color(255, 100, 100), 0.8, false);
  // Reflected Ray (Fades out!)
  drawWaveRay(cx, cy, -ti, 200, color(255, 0, 0, intens * 255), intens, false);
}

function drawWaveRay(x, y, angle, len, col, amp, isIncoming) {
  stroke(col);
  strokeWeight(2);
  
  let dir = isIncoming ? -1 : 1;
  
  for (let i = 0; i < len; i += 2) {
    let d = i * dir;
    let px = x + d * sin(angle);
    let py = y - d * cos(angle);
    
    // The "Wave" visualization (Electric Field oscillation)
    // At Brewster's Angle, the amplitude for the reflected ray hits 0
    let wave = sin(i * 0.2 - time) * (15 * amp);
    let wx = px + wave * cos(angle);
    let wy = py + wave * sin(angle);
    
    point(wx, wy);
  }
}

function drawGraph(currentAngle, currentIntens) {
  let gx = 620;
  let gy = 350;
  let gw = 150;
  let gh = 100;
  
  // Draw Graph Axes
  stroke(0); strokeWeight(1);
  line(gx, gy, gx + gw, gy); // X axis (Angle)
  line(gx, gy, gx, gy - gh); // Y axis (Intensity)
  
  // Draw Fresnel Curve
  noFill(); stroke(0, 100, 255, 150);
  beginShape();
  for (let a = 0; a < 90; a++) {
    let r_a = radians(a);
    let r_t = asin((n1 * sin(r_a)) / n2);
    let r_intens = pow(tan(r_a - r_t) / tan(r_a + r_t), 2);
    vertex(gx + (a / 90) * gw, gy - r_intens * gh);
  }
  endShape();
  
  // Draw Current Point
  fill(255, 0, 0); noStroke();
  ellipse(gx + (currentAngle / 90) * gw, gy - currentIntens * gh, 6, 6);
  
  fill(0); textSize(10);
  text("0°", gx, gy + 15);
  text("90°", gx + gw - 15, gy + 15);
  text("Intensity vs Angle", gx, gy - gh - 10);
}
