import React, { useState, useEffect } from "react"; // Import useEffect
import { Wish } from "./types";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { WishProvider } from "./hooks/useWishes";
import Header from "./components/Header";
import Wishlist from "./components/Wishlist";
import CreateWishModal from "./components/CreateWishModal";
import ContributeModal from "./components/ContributeModal";

// Import the Farcaster MiniApp SDK
import { sdk } from "@farcaster/miniapp-sdk";

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isContributeModalOpen, setContributeModalOpen] = useState(false);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  // Use useEffect to call sdk.actions.ready() once the component mounts
  useEffect(() => {
    const notifySDKReady = async () => {
      try {
        console.log("Notifying Farcaster SDK that app is ready...");
        await sdk.actions.ready();
        console.log("Farcaster SDK ready signal sent!");
      } catch (error) {
        console.error("Failed to notify Farcaster SDK:", error);
      }
    };

    notifySDKReady();
  }, []); // Empty dependency array ensures this runs only once after initial render

  const handleOpenContributeModal = (wish: Wish) => {
    setSelectedWish(wish);
    setContributeModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    if (user) {
      setCreateModalOpen(true);
    } else {
      alert("Please sign in to create a wish.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header onCreateWish={handleOpenCreateModal} />
      <main className="container mx-auto">
        <Wishlist onContribute={handleOpenContributeModal} />
      </main>
      <CreateWishModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <ContributeModal
        isOpen={isContributeModalOpen}
        onClose={() => setContributeModalOpen(false)}
        wish={selectedWish}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WishProvider>
        <AppContent />
      </WishProvider>
    </AuthProvider>
  );
};

export default App;
