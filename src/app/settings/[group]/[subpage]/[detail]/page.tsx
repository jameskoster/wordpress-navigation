"use client";

import PageHeader from "@/components/PageHeader/PageHeader";
import PageContent from "@/components/PageContent/PageContent";

const cardStyle = {
  background: "#f9f9f9",
  borderRadius: "6px",
  padding: "16px 20px",
  border: "1px solid #eee",
  marginBottom: "12px",
};

const labelStyle = {
  fontSize: "12px",
  fontWeight: 600 as const,
  color: "#666",
  textTransform: "uppercase" as const,
  letterSpacing: "0.03em",
  marginBottom: "6px",
};

const valueStyle = {
  fontSize: "14px",
  color: "#333",
};

export default function SettingsDetailPage() {
  return (
    <>
      <PageHeader />
      <PageContent>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={cardStyle}>
            <div style={labelStyle}>Shipping Methods</div>
            <div style={valueStyle}>Flat rate, Free shipping</div>
          </div>
          <div style={cardStyle}>
            <div style={labelStyle}>Regions</div>
            <div style={valueStyle}>All states included</div>
          </div>
        </div>
        <div style={{ ...cardStyle, marginTop: "4px" }}>
          <div style={labelStyle}>Flat Rate Settings</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "8px" }}>
            <div>
              <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>Cost</div>
              <div style={valueStyle}>$10.00</div>
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#666", marginBottom: "4px" }}>Tax Status</div>
              <div style={valueStyle}>Taxable</div>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}
