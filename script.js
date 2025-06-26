class RubiksCube {
  constructor() {
    this.resetCube();
    this.moveLog = [];
  }

  resetCube() {
    this.faces = {
      U: Array(9).fill('w'), // Up (white)
      D: Array(9).fill('y'), // Down (yellow)
      F: Array(9).fill('g'), // Front (green)
      B: Array(9).fill('b'), // Back (blue)
      L: Array(9).fill('o'), // Left (orange)
      R: Array(9).fill('r')  // Right (red)
    };
  }

  _rotateFaceArray(faceArray, clockwise) {
    const [a, b, c, d, e, f, g, h, i] = faceArray;
    return clockwise
      ? [g, d, a, h, e, b, i, f, c]
      : [c, f, i, b, e, h, a, d, g];
  }

  rotateFace(face, clockwise = true) {
    this.faces[face] = this._rotateFaceArray(this.faces[face], clockwise);

    const adjacentFaces = {
      U: [['B', 0, 1, 2], ['R', 0, 1, 2], ['F', 0, 1, 2], ['L', 0, 1, 2]],
      D: [['F', 6, 7, 8], ['R', 6, 7, 8], ['B', 6, 7, 8], ['L', 6, 7, 8]],
      F: [['U', 6, 7, 8], ['R', 0, 3, 6], ['D', 2, 1, 0], ['L', 8, 5, 2]],
      B: [['U', 2, 1, 0], ['L', 0, 3, 6], ['D', 6, 7, 8], ['R', 8, 5, 2]],
      L: [['U', 0, 3, 6], ['F', 0, 3, 6], ['D', 0, 3, 6], ['B', 8, 5, 2]],
      R: [['U', 8, 5, 2], ['B', 0, 3, 6], ['D', 8, 5, 2], ['F', 8, 5, 2]]
    };

    const sides = adjacentFaces[face];
    const temp = sides.map(([f, i1, i2, i3]) => [this.faces[f][i1], this.faces[f][i2], this.faces[f][i3]]);

    for (let i = 0; i < 4; i++) {
      const [f1, i1, i2, i3] = sides[i];
      const [f2, j1, j2, j3] = sides[(clockwise ? i + 3 : i + 1) % 4];
      [this.faces[f1][i1], this.faces[f1][i2], this.faces[f1][i3]] = [
        this.faces[f2][j1],
        this.faces[f2][j2],
        this.faces[f2][j3]
      ];
    }
  }

  scramble(moves = 10) {
    const faces = ['U', 'D', 'F', 'B', 'L', 'R'];
    for (let i = 0; i < moves; i++) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      const clockwise = Math.random() > 0.5;
      this.rotateFace(face, clockwise);
    }
  }

  toColorString() {
    const order = ['U', 'R', 'F', 'D', 'L', 'B'];
    return order.map(face => this.faces[face].join('')).join('');
  }

  performMove(move) {
    const clockwise = !move.includes("'");
    const face = move[0];
    this.rotateFace(face, clockwise);
    this.moveLog.push(move);
  }

  performMoves(sequence) {
    for (let move of sequence.trim().split(" ")) {
      this.performMove(move);
    }
  }

  solveStepByStep() {
    this.moveLog = [];
    this.performMoves("F R U R' U' F'");
    this.performMoves("U R U' R' U' F' U F");
    this.performMoves("U R U' R' U' F' U F");
    this.performMoves("F R U R' U' F'");
    // alert removed to avoid popup on every click
  }
}

function getCubeSvg(colorString) {
  const colorMap = { w: 'white', y: 'yellow', g: 'green', b: 'blue', o: 'orange', r: 'red' };
  let svg = '<svg width="300" height="200">';
  const facePos = {
    U: [3, 0], R: [6, 3], F: [3, 3], D: [3, 6], L: [0, 3], B: [9, 3]
  };
  const faceOrder = ['U', 'R', 'F', 'D', 'L', 'B'];
  let index = 0;

  for (let f of faceOrder) {
    const [x0, y0] = facePos[f];
    for (let i = 0; i < 9; i++) {
      const color = colorMap[colorString[index++]];
      const x = x0 + (i % 3);
      const y = y0 + Math.floor(i / 3);
      svg += `<rect x="${x * 20}" y="${y * 20}" width="20" height="20" fill="${color}" stroke="black"/>`;
    }
  }

  svg += '</svg>';
  return svg;
}

const cube = new RubiksCube();

function displayCube() {
  const svg = getCubeSvg(cube.toColorString());
  document.getElementById("cubeDisplay").innerHTML = svg;
}

function scrambleCube() {
  cube.scramble();
  displayCube();
}

function solveCube() {
  cube.solveStepByStep();
  displayCube();
}

displayCube();
