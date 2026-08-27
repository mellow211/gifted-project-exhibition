"use client";

import React, { useState, useEffect } from "react";
import { AdminAuth } from "@/components/admin/AdminAuth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("gifted_admin_user");
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch {}
    setLoaded(true);
  }, []);

  const handleAuthenticated = (user: any) => {
    setCurrentUser(user);
    try {
      sessionStorage.setItem("gifted_admin_user", JSON.stringify(user));
    } catch {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem("gifted_admin_user");
    } catch {}
  };

  if (!loaded) {
    return (
      <div className="pt-32 pb-24 text-center text-xs text-navy-400">
        관리자 콘솔 초기화 중...
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-surface">
      {currentUser ? (
        <AdminDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AdminAuth onAuthenticated={handleAuthenticated} />
        </div>
      )}
    </div>
  );
}
