"use client";

import { usePearlvine } from "@/context/PearlvineContext";
import DashboardLayout from "@/components/features/dashboard/DashboardLayout";
import DashboardOverview from "@/components/features/dashboard/DashboardOverview";
import AutoPoolSection from "@/components/features/dashboard/AutoPoolSection";
import ReferralsSection from "@/components/features/dashboard/ReferralsSection";
import LevelIncomeSection from "@/components/features/dashboard/LevelIncomeSection";

export default function DashboardScreen() {
  const { userPane } = usePearlvine();

  return (
    <DashboardLayout>
      {userPane === "main" && <DashboardOverview />}
      {userPane === "autopool" && <AutoPoolSection />}
      {userPane === "referrals" && <ReferralsSection />}
      {userPane === "level" && <LevelIncomeSection />}
      
    </DashboardLayout>
  );
}
