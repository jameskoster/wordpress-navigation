"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/PageHeader/PageHeader";
import PageContent from "@/components/PageContent/PageContent";

const shippingZones = [
  {
    name: "United States",
    slug: "united-states",
    regions: "US States (all)",
    methods: "Flat rate, Free shipping",
  },
  {
    name: "Europe",
    slug: "europe",
    regions: "EU Countries (27)",
    methods: "Flat rate",
  },
  {
    name: "Rest of World",
    slug: "rest-of-world",
    regions: "All other countries",
    methods: "Flat rate",
  },
];

const tableStyles = {
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "13.5px",
  },
  th: {
    textAlign: "left" as const,
    padding: "10px 12px",
    borderBottom: "2px solid #e0e0e0",
    fontSize: "12px",
    fontWeight: 600,
    color: "#666",
    textTransform: "uppercase" as const,
    letterSpacing: "0.03em",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    color: "#333",
  },
  link: {
    color: "#2271b1",
    fontWeight: 500,
    textDecoration: "none" as const,
  },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "12px",
    background: "#f0f0f1",
    color: "#666",
    marginRight: "4px",
  },
};

export default function PluginDetailPage() {
  const params = useParams();
  const isZonesPage =
    params.plugin === "woocommerce" &&
    params.subpage === "shipping" &&
    params.detail === "zones-and-rates";

  if (isZonesPage) {
    return (
      <>
        <PageHeader />
        <PageContent>
          <table style={tableStyles.table}>
            <thead>
              <tr>
                <th style={tableStyles.th}>Zone Name</th>
                <th style={tableStyles.th}>Regions</th>
                <th style={tableStyles.th}>Shipping Methods</th>
              </tr>
            </thead>
            <tbody>
              {shippingZones.map((zone) => (
                <tr key={zone.slug}>
                  <td style={tableStyles.td}>
                    <Link
                      href={`/plugins/woocommerce/shipping/zones-and-rates/${zone.slug}`}
                      style={tableStyles.link}
                    >
                      {zone.name}
                    </Link>
                  </td>
                  <td style={tableStyles.td}>{zone.regions}</td>
                  <td style={tableStyles.td}>
                    {zone.methods.split(", ").map((method) => (
                      <span key={method} style={tableStyles.badge}>
                        {method}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PageContent>
      </>
    );
  }

  return (
    <>
      <PageHeader />
      <PageContent />
    </>
  );
}
