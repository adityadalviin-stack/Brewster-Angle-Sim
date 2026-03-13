let angleSlider;
let n1 = 1.0; // Refractive index of Air
let n2 = 1.5; // Refractive index of Glass

function setup() {
  createCanvas(600, 400);
  angleSlider = createSlider(0, 89, 45);
  // Positions the slider right below the canvas
  angleSlider.position(windowWidth/2 - 65, 520); 
}

function draw() {
  background(255);
  let thetaI_deg = angleSlider.value();
  let thetaI = radians(thetaI_deg);

  // Snell's Law for Refraction
  let thetaT = asin((n1 * sin(thetaI)) / n2);

  // Fresnel Equation for Reflected Intensity (p-polarization)
  let intensity = pow(tan(thetaI - thetaT) / tan(thetaI + thetaT), 2);
  let brewster = degrees(atan(n2/n1));

  drawSimulation(thetaI, thetaT, intensity);

  // Data Readout Overlay
  fill(0); noStroke(); textSize(16); textAlign(LEFT);
  text(`Incident Angle: ${thetaI_deg}°`, 20, 30);
  text(`Theoretical Brewster's Angle: ${brewster.toFixed(1)}°`, 20, 55);
  text(`Reflected Intensity: ${(intensity * 100).toFixed(2)}%`, 20, 80);
}

function drawSimulation(thetaI, thetaT, intensity) {
  let cx = width / 2;
  let cy = height / 2;

  // Draw Glass Medium
  fill(220, 240, 255); noStroke();
  rect(0, cy, width, height / 2);

  // Draw Normal Line
  stroke(150); drawingContext.setLineDash([5, 5]);
  line(cx, 50, cx, 350); drawingContext.setLineDash([]);

  // Incident Ray
  stroke(255, 0, 0); strokeWeight(3);
  line(cx - 150 * sin(thetaI), cy - 150 * cos(thetaI), cx, cy);

  // Refracted Ray
  stroke(255, 100, 100);
  line(cx, cy, cx + 150 * sin(thetaT), cy + 150 * cos(thetaT));

  // Reflected Ray (Fades based on intensity)
  stroke(255, 0, 0, intensity * 255);
  line(cx, cy, cx + 150 * sin(thetaI), cy - 150 * cos(thetaI));
}
