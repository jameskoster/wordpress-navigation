import PageHeader from "@/components/PageHeader/PageHeader";
import PageContent from "@/components/PageContent/PageContent";

export default function DashboardPage() {
  return (
    <>
      <PageHeader />
      <PageContent>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div
            style={{
              background: "#f9f9f9",
              borderRadius: "6px",
              padding: "20px",
              border: "1px solid #eee",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
              At a Glance
            </h3>
            <p style={{ fontSize: "13px", color: "#666" }}>
              5 Posts, 12 Pages, 3 Comments
            </p>
          </div>
          <div
            style={{
              background: "#f9f9f9",
              borderRadius: "6px",
              padding: "20px",
              border: "1px solid #eee",
            }}
          >
            <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
              Activity
            </h3>
            <p style={{ fontSize: "13px", color: "#666" }}>
              Recently published: &quot;Hello World&quot;
            </p>
          </div>
        </div>
      </PageContent>
    </>
  );
}
