"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type Company = {
  id: string;
  name: string;
  sector: string;
  stage: string;
  totalInvestedAmount: number;
  ownershipPct: number;
  currentValuation: number | null;
  status: string;
};

type SortKey = "name" | "sector" | "stage" | "totalInvestedAmount" | "ownershipPct" | "currentValuation" | "status";
type SortDir = "asc" | "desc";

const columns: { key: SortKey; label: string }[] = [
  { key: "name", label: "Company" },
  { key: "sector", label: "Sector" },
  { key: "stage", label: "Stage" },
  { key: "totalInvestedAmount", label: "Invested" },
  { key: "ownershipPct", label: "Ownership" },
  { key: "currentValuation", label: "Valuation" },
  { key: "status", label: "Status" },
];

export default function SortableTable({ companies }: { companies: Company[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...companies].sort((a, b) => {
    const aVal = a[sortKey] ?? "";
    const bVal = b[sortKey] ?? "";
    const cmp =
      typeof aVal === "number" && typeof bVal === "number"
        ? aVal - bVal
        : String(aVal).localeCompare(String(bVal));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (col !== sortKey) return <ChevronsUpDown size={13} className="ml-1 text-gray-300" />;
    return sortDir === "asc"
      ? <ChevronUp size={13} className="ml-1 text-indigo-500" />
      : <ChevronDown size={13} className="ml-1 text-indigo-500" />;
  };

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500 border-b border-gray-100 bg-gray-50/50">
          {columns.map(({ key, label }) => (
            <th key={key} className="px-5 py-3 font-medium">
              <button
                onClick={() => handleSort(key)}
                className="flex items-center gap-0.5 hover:text-indigo-600 transition-colors group"
              >
                {label}
                <SortIcon col={key} />
              </button>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((c) => (
          <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td className="px-5 py-3">
              <a href={`/portfolio/${c.id}`} className="font-medium text-indigo-600 hover:underline">
                {c.name}
              </a>
            </td>
            <td className="px-5 py-3 text-gray-600">{c.sector}</td>
            <td className="px-5 py-3 text-gray-600">{c.stage}</td>
            <td className="px-5 py-3 text-gray-600">${(c.totalInvestedAmount / 1e6).toFixed(2)}M</td>
            <td className="px-5 py-3 text-gray-600">{c.ownershipPct}%</td>
            <td className="px-5 py-3 text-gray-600">
              {c.currentValuation ? `$${(c.currentValuation / 1e6).toFixed(1)}M` : "—"}
            </td>
            <td className="px-5 py-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  c.status === "Active"
                    ? "bg-emerald-50 text-emerald-600"
                    : c.status === "Exited"
                    ? "bg-blue-50 text-blue-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {c.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
