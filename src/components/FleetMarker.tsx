import React, { useEffect, useState, useMemo } from 'react';
import { Group, Path, Circle } from 'react-konva';
import { hexToPixel } from '../utils/hex';

interface FleetMarkerProps {
    startQ: number;
    startR: number;
    targetQ: number;
    targetR: number;
    startTime: number;
    arrivalTime: number;
    owner: string;
    isMyFleet: boolean;
}

const FleetMarker: React.FC<FleetMarkerProps> = ({
    startQ, startR, targetQ, targetR, startTime, arrivalTime, isMyFleet
}) => {
    const [position, setPosition] = useState({ x: 0, y: 0, angle: 0 });

    const startPos = useMemo(() => hexToPixel({ q: startQ, r: startR }), [startQ, startR]);
    const targetPos = useMemo(() => hexToPixel({ q: targetQ, r: targetR }), [targetQ, targetR]);

    useEffect(() => {
        const updatePosition = () => {
            const now = Date.now();
            const totalDuration = arrivalTime - startTime;
            const elapsed = now - startTime;

            // Calculate progress (0 to 1)
            let progress = Math.max(0, Math.min(1, elapsed / totalDuration));

            // Linear interpolation
            const currentX = startPos.x + (targetPos.x - startPos.x) * progress;
            const currentY = startPos.y + (targetPos.y - startPos.y) * progress;

            // Calculate angle
            const dx = targetPos.x - startPos.x;
            const dy = targetPos.y - startPos.y;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Degrees

            setPosition({ x: currentX, y: currentY, angle });

            if (progress < 1) {
                requestAnimationFrame(updatePosition);
            }
        };

        const animationId = requestAnimationFrame(updatePosition);
        return () => cancelAnimationFrame(animationId);
    }, [startPos, targetPos, startTime, arrivalTime]);

    const color = isMyFleet ? '#b26e41' : '#8b0000'; // Brass for me, Red for enemy

    return (
        <Group x={position.x} y={position.y} rotation={position.angle}>
            {/* Simple Airship Shape */}
            {/* Main Hull */}
            <Path
                data="M -15 0 Q -5 -10 10 0 Q -5 10 -15 0 Z"
                fill={color}
                stroke="black"
                strokeWidth={1}
                shadowColor="black"
                shadowBlur={5}
                shadowOpacity={0.5}
            />
            {/* Engine / Propeller hint */}
            <Circle x={-15} y={0} radius={3} fill="#555" />

            {/* Visual indicator for "movement" or exhaust could go here */}
        </Group>
    );
};

export default FleetMarker;
