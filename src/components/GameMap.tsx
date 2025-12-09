import React, { useState, useMemo } from 'react';
import { Stage, Layer } from 'react-konva';
import HexTile from './HexTile';
import CloudOverlay from './CloudOverlay';
import FleetMarker from './FleetMarker';
import UIOverlay from './UIOverlay';
import { useQuery, useMutation } from '../../convex/_generated/react';
import { api } from '../../convex/_generated/api';

const GameMap: React.FC = () => {
    // view state removed if unused, but kept for drag logic placeholder
    const [selectedHex, setSelectedHex] = useState<{q: number, r: number} | null>(null);

    // Fetch visible sector
    const islands = useQuery(api.islands.getSector, { minQ: -10, maxQ: 10, minR: -10, maxR: 10 });
    const user = useQuery(api.users.getMyUser);
    const fleets = useQuery(api.fleets.getFleetsInSector, { minQ: -10, maxQ: 10, minR: -10, maxR: 10 });
    const claimIsland = useMutation(api.islands.claim);

    const handleStageClick = (e: any) => {
        if (e.target === e.target.getStage()) {
            setSelectedHex(null);
        }
    };

    const handleHexClick = (q: number, r: number) => {
        setSelectedHex({ q, r });
        // Auto-claim for demo purposes if unowned
        claimIsland({ q, r }).catch(console.error);
    };

    // Calculate visibility (Fog of War)
    const visibleHexes = useMemo(() => {
        const visible = new Set<string>();
        if (!islands || !user) return visible;

        islands.forEach((island: any) => {
            if (island.owner === user._id) {
                visible.add(`${island.q},${island.r}`);
                 for (let dq = -2; dq <= 2; dq++) {
                    for (let dr = -2; dr <= 2; dr++) {
                        if (Math.abs(dq + dr) <= 2) {
                            visible.add(`${island.q + dq},${island.r + dr}`);
                        }
                    }
                }
            }
        });

        visible.add("0,0"); // Starting visibility
        return visible;
    }, [islands, user]);

    return (
        <div className="w-full h-screen bg-void-slate overflow-hidden relative">
            <Stage
                width={window.innerWidth}
                height={window.innerHeight}
                draggable
                onClick={handleStageClick}
                x={window.innerWidth / 2}
                y={window.innerHeight / 2}
            >
                <Layer>
                    {islands?.map((island: any) => {
                        const isVisible = visibleHexes.has(`${island.q},${island.r}`);

                        return (
                            <React.Fragment key={`${island.q},${island.r}`}>
                                <HexTile
                                    q={island.q}
                                    r={island.r}
                                    type={island.type}
                                    owner={island.owner}
                                    isSelected={selectedHex?.q === island.q && selectedHex?.r === island.r}
                                    onClick={handleHexClick}
                                />
                                {!isVisible && (
                                    <CloudOverlay q={island.q} r={island.r} />
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Fleets Layer - Render on top of tiles but below UI */}
                    {fleets?.map((fleet: any) => (
                        <FleetMarker
                            key={fleet._id}
                            startQ={fleet.startQ}
                            startR={fleet.startR}
                            targetQ={fleet.targetQ}
                            targetR={fleet.targetR}
                            startTime={fleet.startTime}
                            arrivalTime={fleet.arrivalTime}
                            owner={fleet.owner}
                            isMyFleet={user ? fleet.owner === user._id : false}
                        />
                    ))}
                </Layer>
            </Stage>

            <UIOverlay selectedHex={selectedHex} />
        </div>
    );
};

export default GameMap;
