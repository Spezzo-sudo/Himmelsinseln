import React from 'react';
import { Circle, Group } from 'react-konva';
import { hexToPixel, HEX_SIZE } from '../utils/hex';

interface CloudOverlayProps {
    q: number;
    r: number;
}

const CloudOverlay: React.FC<CloudOverlayProps> = ({ q, r }) => {
    const { x, y } = hexToPixel({ q, r });

    // Deterministic random based on coordinates to make clouds look consistent but organic
    const pseudoRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    const seed = q * 1000 + r;
    const cloudCount = 3 + Math.floor(pseudoRandom(seed) * 3); // 3 to 5 puffs per hex

    return (
        <Group x={x} y={y}>
            {Array.from({ length: cloudCount }).map((_, i) => {
                const offsetX = (pseudoRandom(seed + i) - 0.5) * HEX_SIZE * 1.5;
                const offsetY = (pseudoRandom(seed + i + 100) - 0.5) * HEX_SIZE * 1.5;
                const radius = (HEX_SIZE / 1.5) + pseudoRandom(seed + i + 200) * (HEX_SIZE / 2);

                return (
                    <Circle
                        key={i}
                        x={offsetX}
                        y={offsetY}
                        radius={radius}
                        fill="#e0e0e0" // Steam white
                        opacity={0.8}
                        shadowColor="black"
                        shadowBlur={20}
                        shadowOpacity={0.3}
                    />
                );
            })}
        </Group>
    );
};

export default CloudOverlay;
