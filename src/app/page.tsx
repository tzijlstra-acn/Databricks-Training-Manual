import type { Metadata } from "next";
import { LearningJourney } from "@/components/home/LearningJourney";
import { BigPictureArchitecture } from "@/components/home/BigPictureArchitecture";
import { FollowTheData } from "@/components/home/FollowTheData";
import { HomeHeader } from "@/components/home/HomeHeader";
import { QuickNav } from "@/components/home/QuickNav";
import { KeyConcepts } from "@/components/home/KeyConcepts";

export const metadata: Metadata = {
  title: "Home | Databricks Learning Platform",
};

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <HomeHeader />
      <LearningJourney />
      <BigPictureArchitecture />
      <FollowTheData />
      <QuickNav />
      <KeyConcepts />
    </div>
  );
}
