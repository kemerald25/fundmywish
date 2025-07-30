import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Wish } from "./types";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { WishProvider } from "./hooks/useWishes";
import Header from "./components/Header";
import Wishlist from "./components/Wishlist";
import WishPage from "./components/WishPage";
import CreateWishModal from "./components/CreateWishModal";
import ContributeModal from "./components/ContributeModal";
import FrameMeta from "./components/FrameMeta";
import { sdk } from "@farcaster/miniapp-sdk";

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isContributeModalOpen, setContributeModalOpen] = useState(false);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);

  useEffect(() => {
    const notifySDKReady = async () => {
      try {
        console.log("Notifying Farcaster SDK that app is ready...");
        console.log("Current location:", location.pathname);
        await sdk.actions.ready();
        console.log("Farcaster SDK ready signal sent!");
      } catch (error) {
        console.error("Failed to notify Farcaster SDK:", error);
      }
    };

    notifySDKReady();
  }, [location.pathname]);

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
        <Routes>
          <Route
            path="/"
            element={
              <>
                <FrameMeta />
                <Wishlist onContribute={handleOpenContributeModal} />
              </>
            }
          />
          <Route
            path="/wish/:id"
            element={<WishPage onContribute={handleOpenContributeModal} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
    <Router>
      <AuthProvider>
        <WishProvider>
          <AppContent />
        </WishProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
