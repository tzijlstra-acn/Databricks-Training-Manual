import type { Metadata } from "next";
import { LearningJourney } from "@/components/home/LearningJourney";
import { BigPictureArchitecture } from "@/components/home/BigPictureArchitecture";
import { FollowTheData } from "@/components/home/FollowTheData";
import { HomeHeader } from "@/components/home/HomeHeader";
import { QuickNav } from "@/components/home/QuickNav";
import { KeyConcepts } from "@/components/home/KeyConcepts";
import { ScenarioIntro } from "@/components/home/ScenarioIntro";

export const metadata: Metadata = {
  title: "Home | Databricks Learning Platform",
};

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* ── Zone 1: Orientation ─────────────────────────────── */}
      <div className="space-y-6 pb-10">
        <HomeHeader />
        <ScenarioIntro />
        <LearningJourney />
        <QuickNav />
      </div>

      {/* ── Zone divider ────────────────────────────────────── */}
      <div className="relative py-4 mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            Interactive learning
          </span>
        </div>
      </div>

      {/* ── Zone 2: Interactive learning ────────────────────── */}
      <div className="space-y-12 pb-16">
        {/* BigPictureArchitecture — featured */}
        <div className="rounded-3xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white px-8 py-6 shadow-sm">
          <BigPictureArchitecture />
        </div>

        {/* Follow The Record */}
        <div className="rounded-3xl border border-orange-200 bg-gradient-to-b from-orange-50 to-white px-8 py-2">
          <FollowTheData />
        </div>

        {/* Key Concepts */}
        <KeyConcepts />
      </div>
    </div>
  );
}
