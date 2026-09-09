import { Page, View, Text } from "@react-pdf/renderer";
import { COLORS, styles } from "../styles";
import {
  PageHeader,
  PageFooter,
  SectionTitle,
  Body,
  CalloutBox,
  SimpleTable,
} from "../shared";

const CREATE_STEPS = [
  {
    num: "1",
    title: "Click + New in the top-left sidebar, then select Notebook",
    detail: "Alternatively: go to Workspace, right-click any folder, and choose Create > Notebook.",
  },
  {
    num: "2",
    title: "Configure the notebook in the dialog",
    detail: "Name: give it a descriptive title (e.g., FirstAnalysis). Default Language: Python or SQL. Compute: select adb-cluster-howden-switzerland-groupdatapoc-we.",
  },
  {
    num: "3",
    title: "Click Create",
    detail: "The notebook opens and is attached to the selected cluster. A green dot confirms the cluster is running.",
  },
];

const EXECUTE_STEPS = [
  {
    num: "1",
    title: "Add a cell",
    detail: "Hover over the top or bottom border of any existing cell and click + Code (for SQL/Python) or + Text (for Markdown documentation).",
  },
  {
    num: "2",
    title: "Write your code",
    detail: "Example SQL query: SELECT * FROM howden.gold.vp_aggregated",
  },
  {
    num: "3",
    title: "Execute the cell",
    detail: "Click the Play icon on the cell toolbar and select Run Cell, or press Shift + Enter. Results appear below the cell.",
  },
];

const MAGIC_COMMANDS = [
  ["%%sql", "Run a SQL cell inside a Python notebook, most common for ad-hoc queries against Howden Gold tables"],
  ["%%python", "Switch a single cell to Python inside a SQL notebook"],
  ["%%md", "Write Markdown documentation, headers, bullet lists, explanatory notes"],
  ["%%scala", "Switch a single cell to Scala, rarely needed for Howden FINMA work"],
];

const AppendixHeader = ({ letter, title, subtitle }: { letter: string; title: string; subtitle: string }) => (
  <View
    style={{
      backgroundColor: COLORS.navy,
      marginLeft: -48,
      marginRight: -48,
      paddingHorizontal: 48,
      paddingVertical: 14,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    }}
  >
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 3,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: COLORS.orange }}>{letter}</Text>
    </View>
    <View>
      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 15, color: COLORS.white }}>{title}</Text>
      <Text style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{subtitle}</Text>
    </View>
  </View>
);

function NumberedSteps({ steps }: { steps: { num: string; title: string; detail: string }[] }) {
  return (
    <View style={{ marginBottom: 10 }}>
      {steps.map((step) => (
        <View
          key={step.num}
          wrap={false}
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 7, marginBottom: 6 }}
        >
          <View
            style={{
              backgroundColor: COLORS.orange,
              width: 20,
              height: 20,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
              marginTop: 1,
            }}
          >
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, color: COLORS.white, lineHeight: 1 }}>
              {step.num}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: COLORS.navy, marginBottom: 1 }}>
              {step.title}
            </Text>
            <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.45 }}>
              {step.detail}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

export function AppendixWorkingWithDatabricks() {
  return (
    <>
      {/* ── Page 1 ── Create, write, execute, magic commands */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Appendix E: Working with Databricks" />
        <PageFooter />

        <AppendixHeader
          letter="E"
          title="Appendix E: Working with Databricks"
          subtitle="Step-by-step: create notebooks, execute code, switch languages"
        />

        <SectionTitle color={COLORS.gray500}>Create a Notebook (Step-by-Step)</SectionTitle>
        <NumberedSteps steps={CREATE_STEPS} />

        <SectionTitle color={COLORS.gray500}>Write and Execute Code in Cells</SectionTitle>
        <NumberedSteps steps={EXECUTE_STEPS} />

        <SectionTitle color={COLORS.gray500}>Switch Languages with Magic Commands</SectionTitle>
        <Body>
          {"Magic commands change the language of a single cell. Place them on the first line of the cell. The most common in Howden notebooks is %%sql, used to run a SQL query inside a Python pipeline notebook."}
        </Body>
        <SimpleTable
          headers={["Command", "What It Does"]}
          rows={MAGIC_COMMANDS}
          colWidths={[0.7, 4.3]}
        />
      </Page>

      {/* ── Page 2 ── Save, export, share */}
      <Page size="A4" style={styles.page}>
        <PageHeader chapter="Appendix E: Working with Databricks" />
        <PageFooter />

        <SectionTitle color={COLORS.gray500}>Save Your Notebook</SectionTitle>
        <View wrap={false} style={{ marginBottom: 10 }}>
          {[
            "Databricks notebooks auto-save every few seconds, no manual save button is needed for routine edits.",
            "Force an immediate save: press Ctrl+S (Windows) or Cmd+S (Mac), or click File > Save.",
            "Verify the save: the top-left corner next to the notebook title shows 'Saved' or the timestamp of the last save.",
          ].map((item, i) => (
            <Text key={i} style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.5, marginBottom: 3 }}>
              {"·  " + item}
            </Text>
          ))}
        </View>

        <SectionTitle color={COLORS.gray500}>Export a Notebook</SectionTitle>
        <Body>
          {"To download a copy to your local machine or share outside the workspace: click File in the top toolbar, hover over Export, and choose your preferred format, Source File (.py / .sql), HTML, or IPython Notebook (.ipynb). The file downloads automatically to your computer."}
        </Body>

        <SectionTitle color={COLORS.gray500}>Share with Collaborators</SectionTitle>
        <View wrap={false} style={{ marginBottom: 12 }}>
          {[
            "Click the Share button (top-right of the notebook interface).",
            "In the sharing dialog, type the email address or name of the user, group, or service principal.",
            "Select the appropriate permission level: Can Read, Can Run, Can Edit, or Can Manage.",
            "Click Add. The user now appears in the permissions list and receives access immediately.",
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 6, marginBottom: 4 }}>
              <Text style={{ fontSize: 8.5, color: COLORS.orange, fontFamily: "Helvetica-Bold", flexShrink: 0 }}>
                {i + 1}.
              </Text>
              <Text style={{ fontSize: 8.5, color: COLORS.gray700, lineHeight: 1.45, flex: 1 }}>
                {item}
              </Text>
            </View>
          ))}
        </View>

        <CalloutBox title="Tip, Recents & Quick Navigation">
          {"After creating or opening any asset, it appears in Recents on the home page and left panel. Use Ctrl+P from anywhere in the workspace to instantly jump to any notebook, table, query, or dashboard, the fastest way to navigate without browsing folders."}
        </CalloutBox>
      </Page>
    </>
  );
}
