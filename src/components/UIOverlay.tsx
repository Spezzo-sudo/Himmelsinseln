import React, { useEffect, useState } from 'react';
import { Panel } from './UIComponents';
import { useQuery } from '../../convex/_generated/react';
import { api } from '../../convex/_generated/api';
// interpolateResources import removed since we implemented logic inline for now to avoid unused var error
// import { interpolateResources } from '../utils/resources';

interface UIOverlayProps {
    selectedHex: {q: number, r: number} | null;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ selectedHex }) => {
    const user = useQuery(api.users.getMyUser);
    const [displayResources, setDisplayResources] = useState({ metal: 0, crystal: 0, gas: 0 });

    useEffect(() => {
        if (!user || !user.resources) return;

        // Sync initial state
        setDisplayResources(user.resources);

        // Production rate per hour (mock value, should ideally come from backend user/island stats)
        const productionRate = 100; // 100 per hour

        // We need a lastUpdated timestamp to interpolate correctly from the server state.
        // Assuming user.resources is the "truth" at the time of fetch.
        // For a smoother visual, we can just increment locally from the fetch time.
        const startTime = Date.now();
        const startResources = user.resources;

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime; // ms elapsed since last sync/fetch

            // Calculate production over this elapsed time
            // Rate is per hour, so per ms is rate / 3600000
            const produced = (productionRate * elapsed) / 3600000;

            setDisplayResources({
                metal: Math.floor(startResources.metal + produced),
                crystal: Math.floor(startResources.crystal + produced),
                gas: Math.floor(startResources.gas + produced) // Assuming equal production for demo
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [user]);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            {/* Top Bar: Resources */}
            <div className="flex justify-center pointer-events-auto">
                <Panel className="flex gap-8 px-8 py-3 bg-opacity-95">
                    <ResourceDisplay type="Metal" value={displayResources.metal} icon="⚙️" />
                    <ResourceDisplay type="Crystal" value={displayResources.crystal} icon="💎" />
                    <ResourceDisplay type="Gas" value={displayResources.gas} icon="☁️" />
                </Panel>
            </div>

            {/* Bottom Left: Selected Info */}
            <div className="flex justify-between items-end pointer-events-auto">
                {selectedHex ? (
                    <Panel title="Sector Analysis" className="w-80 h-64">
                        <div className="space-y-2">
                            <p className="text-brass-primary">Coordinates: <span className="text-steam-white">{selectedHex.q}, {selectedHex.r}</span></p>
                            <p className="text-brass-primary">Status: <span className="text-steam-white">Unexplored</span></p>

                            <div className="mt-8 flex gap-2">
                                {/* Actions placeholders */}
                            </div>
                        </div>
                    </Panel>
                ) : (
                    <div />
                )}

                {/* Bottom Right: Mini Map or Actions */}
                <Panel title="Command Deck" className="w-64">
                   <div className="grid grid-cols-2 gap-2">
                       {/* Menu placeholders */}
                   </div>
                </Panel>
            </div>
        </div>
    );
};

const ResourceDisplay: React.FC<{ type: string, value: number, icon: string }> = ({ type, value, icon }) => (
    <div className="flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        <div className="flex flex-col">
            <span className="text-xs text-brass-primary uppercase tracking-widest">{type}</span>
            <span className="font-mono text-lg font-bold text-steam-white">{Math.floor(value).toLocaleString()}</span>
        </div>
    </div>
);

export default UIOverlay;
