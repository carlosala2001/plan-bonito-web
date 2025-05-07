
import { Plan } from "@/components/PlanCard";

export const plansData: Plan[] = [
  {
    name: "MiniCube",
    price: 10,
    credits: 10,
    resources: {
      cpu: { value: "1.5", unit: "vCores" },
      ram: { value: 2048, unit: "MB" },
      disk: { value: 10240, unit: "MB" },
      backups: 2,
      databases: 1,
      ports: 1
    },
    billing: "por Mes",
    minCredits: 20000,
    description: {
      idealFor: "Small projects, testing, lightweight bots, and vanilla servers.",
      perfectFor: "Getting started with minimal load and testing ideas."
    }
  },
  {
    name: "Galaxy",
    price: 26,
    credits: 26,
    resources: {
      cpu: { value: "2", unit: "vCores" },
      ram: { value: 3072, unit: "MB" },
      disk: { value: 15360, unit: "MB" },
      backups: 2,
      databases: 1,
      ports: 2
    },
    billing: "por Mes",
    minCredits: 26000,
    description: {
      idealFor: "Simple game servers or lightweight websites.",
      perfectFor: "Light server applications or basic modded environments."
    }
  },
  {
    name: "Obsidian",
    price: 42,
    credits: 42,
    resources: {
      cpu: { value: "2", unit: "vCores" },
      ram: { value: 4096, unit: "MB" },
      disk: { value: 20480, unit: "MB" },
      backups: 3,
      databases: 2,
      ports: 3
    },
    billing: "por Mes",
    minCredits: 42000,
    description: {
      idealFor: "Multiplayer games, moderate modpacks, and medium web applications.",
      perfectFor: "Hosting larger servers and keeping up with moderate traffic."
    },
    highlight: true
  },
  {
    name: "Inferno",
    price: 56,
    credits: 56,
    resources: {
      cpu: { value: "3.5", unit: "vCores" },
      ram: { value: 5120, unit: "MB" },
      disk: { value: 25600, unit: "MB" },
      backups: 3,
      databases: 3,
      ports: 4
    },
    billing: "por Mes",
    minCredits: 56000,
    description: {
      idealFor: "More demanding modpacks and medium-sized multiplayer worlds.",
      perfectFor: "Projects that require higher performance and more resources."
    }
  },
  {
    name: "Storm",
    price: 70,
    credits: 70,
    resources: {
      cpu: { value: "4", unit: "vCores" },
      ram: { value: 8192, unit: "MB" },
      disk: { value: 51200, unit: "MB" },
      backups: 3,
      databases: 4,
      ports: 5
    },
    billing: "por Mes",
    minCredits: 70000,
    description: {
      idealFor: "Servers with high player counts, large modpacks, or heavy web applications.",
      perfectFor: "High-traffic or resource-intensive projects."
    }
  },
  {
    name: "Dragon",
    price: 112,
    credits: 112,
    resources: {
      cpu: { value: "5.5", unit: "vCores" },
      ram: { value: 10240, unit: "MB" },
      disk: { value: 71680, unit: "MB" },
      backups: 6,
      databases: 6,
      ports: 6
    },
    billing: "por Mes",
    minCredits: 112000,
    description: {
      idealFor: "Large modpacks like Pixelmon or RLCraft, and high-performance servers.",
      perfectFor: "Hosting large-scale gaming projects or community servers."
    }
  },
  {
    name: "Quantum",
    price: 140,
    credits: 140,
    resources: {
      cpu: { value: "6", unit: "vCores" },
      ram: { value: 12288, unit: "MB" },
      disk: { value: 102400, unit: "MB" },
      backups: 8,
      databases: 8,
      ports: 10
    },
    billing: "por Mes",
    minCredits: 140000,
    description: {
      idealFor: "Advanced gaming servers, custom survival worlds, and large web applications.",
      perfectFor: "Projects that need high-end performance for multiple users and worlds."
    }
  },
  {
    name: "Nebula",
    price: 176,
    credits: 176,
    resources: {
      cpu: { value: "6.5", unit: "vCores" },
      ram: { value: 16384, unit: "MB" },
      disk: { value: 190360, unit: "MB" },
      backups: 12,
      databases: 16,
      ports: 16
    },
    billing: "por Mes",
    minCredits: 176000,
    description: {
      idealFor: "Large-scale networks, high-performance gaming, and custom modded worlds.",
      perfectFor: "Extensive projects and large player communities."
    }
  },
  {
    name: "Titan",
    price: 210,
    credits: 210,
    resources: {
      cpu: { value: "7.5", unit: "vCores" },
      ram: { value: 20480, unit: "MB" },
      disk: { value: 256000, unit: "MB" },
      backups: 25,
      databases: 25,
      ports: 25
    },
    billing: "por Mes",
    minCredits: 210000,
    description: {
      idealFor: "Massive multiplayer environments, professional-level modpacks, or event-driven servers.",
      perfectFor: "Top-tier gaming and performance, with extensive resources and flexibility."
    }
  },
  {
    name: "ZenoScale",
    price: 300,
    credits: 300,
    resources: {
      cpu: { value: "9.5", unit: "vCores" },
      ram: { value: 29960, unit: "MB" },
      disk: { value: 512720, unit: "MB" },
      backups: 100,
      databases: 100,
      ports: 100
    },
    billing: "por Mes",
    minCredits: 300000,
    description: {
      idealFor: "Top-level projects, massive events, and full-scale networks.",
      perfectFor: "The most demanding applications, events, and gaming environments."
    }
  }
];
