import React from 'react';
import { RegularPolygon, Group, Text, Circle } from 'react-konva';
import { hexToPixel, HEX_SIZE } from '../utils/hex';

interface HexTileProps {
    q: number;
    r: number;
    type: string;
    owner?: string;
    onClick: (q: number, r: number) => void;
    isSelected?: boolean;
}

const HexTile: React.FC<HexTileProps> = ({ q, r, type, owner, onClick, isSelected }) => {
    const { x, y } = hexToPixel({ q, r });

    let fillColor = '#1a1a1a'; // Default dark
    let strokeColor = '#333';

    // Steampunk/Aether theme colors
    if (type === 'metal') {
        fillColor = '#2c2c2c'; // Dark Iron
        strokeColor = '#5c5c5c';
    }
    if (type === 'crystal') {
        fillColor = '#1e3a4c'; // Deep Blue
        strokeColor = '#4a8bad';
    }
    if (type === 'gas') {
        fillColor = '#253825'; // Toxic Green
        strokeColor = '#558b2f';
    }

    if (owner) {
        // If owned, add a border or overlay
        // For now, just a distinct color
        fillColor = '#3e2723'; // Bronze/Brown for owned
    }

    return (
        <Group
            x={x}
            y={y}
            onClick={() => onClick(q, r)}
            onTap={() => onClick(q, r)}
        >
            <RegularPolygon
                sides={6}
                radius={HEX_SIZE - 1}
                fill={fillColor}
                stroke={isSelected ? '#b26e41' : strokeColor}
                strokeWidth={isSelected ? 3 : 1}
                shadowColor="black"
                shadowBlur={10}
                shadowOpacity={0.6}
            />

            {/* Simple decoration to differentiate types visually beyond color */}
            {type === 'metal' && <Circle radius={4} fill="#5c5c5c" />}
            {type === 'crystal' && <RegularPolygon sides={3} radius={4} fill="#4a8bad" />}
            {type === 'gas' && <Circle radius={4} fill="#558b2f" opacity={0.5} />}

            {/* Coordinate debug (optional, can be toggleable) */}
            <Text
                text={`${q},${r}`}
                fontSize={8}
                fill="#666"
                align="center"
                x={-10}
                y={-4}
                listening={false}
            />
        </Group>
    );
};

export default HexTile;
