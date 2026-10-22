"use client";

import React from "react";
import { usePearlvine } from "@/context/PearlvineContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeView from "@/components/features/home/HomeView";
import AboutView from "@/components/features/about/AboutView";
import StructureView from "@/components/features/structure/StructureView";
import LoginForm from "@/components/features/auth/LoginForm";
import RegisterForm from "@/components/features/auth/RegisterForm";
import DashboardLayout from "@/components/features/dashboard/DashboardLayout";
import DashboardOverview from "@/components/features/dashboard/DashboardOverview";
import AutoPoolSection from "@/components/features/dashboard/AutoPoolSection";
import ReferralsSection from "@/components/features/dashboard/ReferralsSection";
import LevelIncomeSection from "@/components/features/dashboard/LevelIncomeSection";
import ScratchCardsSection from "@/components/features/dashboard/ScratchCardsSection";
import ClaimsSection from "@/components/features/dashboard/ClaimsSection";
import TransactionsSection from "@/components/features/dashboard/TransactionsSection";
import NotificationsSection from "@/components/features/dashboard/NotificationsSection";
import ProfileSection from "@/components/features/dashboard/ProfileSection";

export default function Page() {
  const { activeTab, userPane } = usePearlvine();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow">
        {activeTab === "home" && <HomeView />}
        {activeTab === "about" && <AboutView />}
        {activeTab === "structure" && <StructureView />}
        {activeTab === "login" && <LoginForm />}
        {activeTab === "register" && <RegisterForm />}

        {activeTab === "dashboard" && (
          <DashboardLayout>
            {userPane === "main" && <DashboardOverview />}
            {userPane === "autopool" && <AutoPoolSection />}
            {userPane === "referrals" && <ReferralsSection />}
            {userPane === "level" && <LevelIncomeSection />}
            {userPane === "scratch" && <ScratchCardsSection />}
            {userPane === "claims" && <ClaimsSection />}
            {userPane === "transactions" && <TransactionsSection />}
            {userPane === "notifications" && <NotificationsSection />}
            {userPane === "profile" && <ProfileSection />}
          </DashboardLayout>
        )}
      </main>

      <Footer />
    </div>
  );
}
