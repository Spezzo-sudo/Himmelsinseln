// Placeholder for resource interpolation
export const interpolateResources = (start: number, rate: number, lastUpdate: number) => {
    const now = Date.now();
    const diff = now - lastUpdate;
    return Math.floor(start + (rate * diff) / (3600 * 1000));
};
