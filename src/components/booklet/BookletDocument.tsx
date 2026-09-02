"use client";

import { Document } from "@react-pdf/renderer";
import { CoverPage } from "./pages/CoverPage";
import { TocPage } from "./pages/TocPage";
import { IntroPage } from "./pages/IntroPage";
import { Chapter1_Foundations } from "./pages/Chapter1_Foundations";
import { Chapter2_DataCatalog } from "./pages/Chapter2_DataCatalog";
import { Chapter3_DevelopQuery } from "./pages/Chapter3_DevelopQuery";
import { Chapter4_AutomateMonitor } from "./pages/Chapter4_AutomateMonitor";
import { Chapter5_AnalyzeApply } from "./pages/Chapter5_AnalyzeApply";
import { AppendixGlossary } from "./pages/AppendixGlossary";
import { AppendixPlatformRef } from "./pages/AppendixPlatformRef";
import { AppendixArchitecture } from "./pages/AppendixArchitecture";

export interface BookletScreenshots {
  home?: string;
  workspace?: string;
  catalog?: string;
  "catalog-tree"?: string;
  compute?: string;
  jobs?: string;
  "job-detail"?: string;
  "dashboard-dqx"?: string;
  genie?: string;
  "medallion-arch"?: string;
  "finma-arch"?: string;
}

interface Props {
  screenshots?: BookletScreenshots;
}

export function BookletDocument({ screenshots = {} }: Props) {
  const ss = screenshots as Record<string, string>;
  return (
    <Document
      title="Databricks Training Booklet — Howden Group"
      author="Howden Group · Accenture"
      subject="Databricks FINMA platform training reference"
      creator="DatabricksLearning Platform"
      producer="@react-pdf/renderer"
    >
      <CoverPage />
      <TocPage />
      <IntroPage screenshots={ss} />
      <Chapter1_Foundations screenshots={ss} />
      <Chapter2_DataCatalog screenshots={ss} />
      <Chapter3_DevelopQuery screenshots={ss} />
      <Chapter4_AutomateMonitor screenshots={ss} />
      <Chapter5_AnalyzeApply screenshots={ss} />
      <AppendixGlossary />
      <AppendixPlatformRef />
      <AppendixArchitecture />
    </Document>
  );
}
