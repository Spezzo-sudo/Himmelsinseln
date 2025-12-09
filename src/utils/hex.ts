// Hexagon grid math utilities

export interface Hex {
    q: number;
    r: number;
    s: number;
}

export interface Point {
    x: number;
    y: number;
}

export const HEX_SIZE = 30; // Radius of hex

export const hexToPixel = (hex: {q: number, r: number}): Point => {
    const x = HEX_SIZE * (3/2 * hex.q);
    const y = HEX_SIZE * (Math.sqrt(3)/2 * hex.q + Math.sqrt(3) * hex.r);
    return { x, y };
};

export const pixelToHex = (x: number, y: number): {q: number, r: number} => {
    const q = (2/3 * x) / HEX_SIZE;
    const r = (-1/3 * x + Math.sqrt(3)/3 * y) / HEX_SIZE;
    return hexRound(q, r);
};

const hexRound = (xq: number, xr: number): {q: number, r: number} => {
    let x = xq;
    let z = xr;
    let y = -x - z;

    let rx = Math.round(x);
    let ry = Math.round(y);
    let rz = Math.round(z);

    const x_diff = Math.abs(rx - x);
    const y_diff = Math.abs(ry - y);
    const z_diff = Math.abs(rz - z);

    if (x_diff > y_diff && x_diff > z_diff) {
        rx = -ry - rz;
    } else if (y_diff > z_diff) {
        ry = -rx - rz;
    } else {
        rz = -rx - ry;
    }

    return { q: rx, r: rz };
};

export const getKey = (q: number, r: number) => `${q},${r}`;
