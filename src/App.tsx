import { ConvexProvider, ConvexReactClient } from "convex/react";
import GameMap from './components/GameMap';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function App() {
  return (
    <ConvexProvider client={convex}>
      <GameMap />
    </ConvexProvider>
  );
}

export default App;
