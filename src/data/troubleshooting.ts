import { TroubleshootingScenario } from "@/lib/types";

export const troubleshootingScenarios: TroubleshootingScenario[] = [
  {
    id: "notebook-not-running",
    title: "My notebook isn't running",
    symptom: "Clicking Run doesn't execute the cell — no output, no error.",
    tree: {
      id: "n1",
      type: "question",
      question: "Is a compute cluster attached?",
      no: {
        id: "n1n",
        type: "solution",
        question: "Attach a compute cluster",
        resolution: "Click the compute dropdown at the top of the notebook and select an available cluster. If none exist, ask your admin to create one.",
      },
      yes: {
        id: "n1y",
        type: "question",
        question: "Is the cluster in 'Running' state?",
        no: {
          id: "n1yn",
          type: "solution",
          question: "Start the compute cluster",
          resolution: "The cluster may have auto-terminated. Click 'Start' on the compute cluster. It typically takes 2–5 minutes to start.",
        },
        yes: {
          id: "n1yy",
          type: "question",
          question: "Do you have 'Can Attach To' permission?",
          no: {
            id: "n1yyn",
            type: "solution",
            question: "Request permissions from admin",
            resolution: "Contact your Databricks admin and request 'Can Attach To' permission on the cluster, or ask them to create a cluster accessible to your group.",
          },
          yes: {
            id: "n1yyy",
            type: "solution",
            question: "Check the cell for syntax errors",
            resolution: "Look at the cell code for syntax errors. Try running a simple cell first: print('hello'). If that works, the issue is in your code logic.",
          },
        },
      },
    },
  },
  {
    id: "cant-find-table",
    title: "I can't find my table",
    symptom: "The table I need isn't showing in Catalog or returns 'table not found' in SQL.",
    tree: {
      id: "t1",
      type: "question",
      question: "Are you looking in the correct catalog?",
      no: {
        id: "t1n",
        type: "solution",
        question: "Switch to the 'enterprise' catalog",
        resolution: "Make sure you're using: enterprise.gold.customer_summary (not just customer_summary). Use the Catalog browser to navigate: enterprise → gold → your table.",
      },
      yes: {
        id: "t1y",
        type: "question",
        question: "Do you have SELECT permission on the table?",
        no: {
          id: "t1yn",
          type: "solution",
          question: "Request table permissions",
          resolution: "Contact your data governance team or admin. They can grant SELECT on the specific table via Unity Catalog permissions.",
        },
        yes: {
          id: "t1yy",
          type: "question",
          question: "Is the table name spelled correctly?",
          no: {
            id: "t1yyn",
            type: "solution",
            question: "Check the table name in Catalog browser",
            resolution: "Open the Catalog browser (left sidebar → Catalog icon), navigate enterprise → gold, and find the exact table name. Copy it.",
          },
          yes: {
            id: "t1yyy",
            type: "solution",
            question: "Ask your data engineer",
            resolution: "The table may not exist yet or may have been renamed. Contact the data engineering team with the table name you're looking for.",
          },
        },
      },
    },
  },
  {
    id: "pipeline-failed",
    title: "A pipeline job failed",
    symptom: "A job shows as 'Failed' in the Jobs & Workflows section.",
    tree: {
      id: "p1",
      type: "question",
      question: "Did the Data Quality task fail?",
      yes: {
        id: "p1y",
        type: "question",
        question: "Is the null rate above the threshold?",
        yes: {
          id: "p1yy",
          type: "solution",
          question: "Investigate source data for missing values",
          resolution: "Query the Bronze table to find records with null commission_amount. Check if the source system had an export issue. Contact the source system team.",
        },
        no: {
          id: "p1yn",
          type: "solution",
          question: "Check DQX audit table for specific rule failures",
          resolution: "Run: SELECT * FROM enterprise.audit.dqx_failures WHERE run_date = current_date() ORDER BY rule_name. This shows which specific records failed which rules.",
        },
      },
      no: {
        id: "p1n",
        type: "question",
        question: "Did a compute cluster terminate mid-run?",
        yes: {
          id: "p1ny",
          type: "solution",
          question: "Increase cluster timeout or use job compute",
          resolution: "Job compute (not all-purpose) is recommended for pipeline jobs — it's more stable. Ask your admin to configure job compute for this workflow.",
        },
        no: {
          id: "p1nn",
          type: "solution",
          question: "Check the task error logs",
          resolution: "Click the failed task in the Job Run view. The 'Error' tab shows the full error message. Copy it and search the Databricks community or contact your data engineer.",
        },
      },
    },
  },
  {
    id: "dashboard-stale",
    title: "My dashboard shows old data",
    symptom: "Dashboard numbers haven't updated — they still show yesterday's or last week's figures.",
    tree: {
      id: "d1",
      type: "question",
      question: "Has the nightly pipeline run successfully today?",
      no: {
        id: "d1n",
        type: "solution",
        question: "Check pipeline status and wait or re-trigger",
        resolution: "Go to Jobs & Workflows and check the status of the nightly commission pipeline. If it failed, contact the data engineering team. If it's still running, wait for it to complete.",
      },
      yes: {
        id: "d1y",
        type: "question",
        question: "Does the dashboard have a refresh schedule?",
        no: {
          id: "d1yn",
          type: "solution",
          question: "Manually refresh the dashboard",
          resolution: "Click the 'Refresh' button on the dashboard, or set up a scheduled refresh. Note: SQL Dashboards require a scheduled refresh or manual trigger to show new data.",
        },
        yes: {
          id: "d1yy",
          type: "question",
          question: "Did the dashboard refresh after the pipeline completed?",
          no: {
            id: "d1yyn",
            type: "solution",
            question: "Check refresh schedule timing",
            resolution: "If the pipeline runs at 2am and the dashboard refreshes at 1am, the dashboard will always show yesterday's data. Adjust the dashboard refresh to run after the pipeline (e.g., 4am).",
          },
          yes: {
            id: "d1yyy",
            type: "solution",
            question: "Clear browser cache and hard reload",
            resolution: "Sometimes dashboards cache in the browser. Try Ctrl+Shift+R to hard reload, or open the dashboard in an incognito window.",
          },
        },
      },
    },
  },
];
