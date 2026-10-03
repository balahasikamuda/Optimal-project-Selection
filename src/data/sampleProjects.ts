import { Project } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Commercial Solar Microgrid & Storage',
    category: 'Renewable Energy',
    initialInvestment: 180000,
    cashFlows: [48000, 56000, 62000, 66000, 72000],
    discountRate: 0.09,
    riskScore: 2,
    strategicScore: 5,
    description: 'Rooftop solar PV installation with industrial battery storage to offset grid peak tariff rates.'
  },
  {
    id: 'proj-2',
    name: 'Enterprise AI Customer Operations',
    category: 'Technology',
    initialInvestment: 95000,
    cashFlows: [38000, 45000, 52000, 55000],
    discountRate: 0.10,
    riskScore: 3,
    strategicScore: 4,
    description: 'Conversational AI and ticket resolution platform delivering immediate labor and support cost savings.'
  },
  {
    id: 'proj-3',
    name: 'Smart Automated Warehouse Robotics',
    category: 'Infrastructure',
    initialInvestment: 260000,
    cashFlows: [60000, 75000, 88000, 96000, 105000, 110000],
    discountRate: 0.11,
    riskScore: 3,
    strategicScore: 4,
    description: 'Autonomous mobile robot (AMR) fleet for fulfillment center pallet routing and inventory sorting.'
  },
  {
    id: 'proj-4',
    name: 'NextGen AI Medical Diagnostics Device',
    category: 'Healthcare',
    initialInvestment: 320000,
    cashFlows: [45000, 80000, 130000, 165000, 195000],
    discountRate: 0.12,
    riskScore: 4,
    strategicScore: 5,
    description: 'FDA-cleared handheld ultrasound scanner powered by real-time neural lesion detection.'
  },
  {
    id: 'proj-5',
    name: 'High-Precision CNC Machining Line',
    category: 'Manufacturing',
    initialInvestment: 140000,
    cashFlows: [40000, 44000, 48000, 50000, 52000],
    discountRate: 0.10,
    riskScore: 2,
    strategicScore: 3,
    description: 'Automated 5-axis milling center to replace legacy mechanical tooling and reduce scrap rate.'
  },
  {
    id: 'proj-6',
    name: 'Zero-Trust Cloud Security Architecture',
    category: 'Technology',
    initialInvestment: 75000,
    cashFlows: [34000, 38000, 42000],
    discountRate: 0.08,
    riskScore: 1,
    strategicScore: 5,
    description: 'Comprehensive endpoint hardening, multi-factor IAM, and real-time SIEM compliance logging.'
  },
  {
    id: 'proj-7',
    name: 'Biodegradable Seaweed Polymer R&D',
    category: 'R&D',
    initialInvestment: 110000,
    cashFlows: [22000, 36000, 48000, 58000],
    discountRate: 0.12,
    riskScore: 4,
    strategicScore: 4,
    description: 'Patentable non-petroleum marine polymers for food and pharmaceutical secondary packaging.'
  },
  {
    id: 'proj-8',
    name: 'IoT Fleet Telematics & Route Optimization',
    category: 'Infrastructure',
    initialInvestment: 85000,
    cashFlows: [30000, 34000, 38000, 42000],
    discountRate: 0.09,
    riskScore: 2,
    strategicScore: 4,
    description: 'Vehicle telemetry and predictive maintenance sensors for fleet trucks to lower fuel and overhaul costs.'
  },
  {
    id: 'proj-9',
    name: 'Experimental Cryogenic Sensor Probe',
    category: 'R&D',
    initialInvestment: 155000,
    cashFlows: [18000, 24000, 32000, 38000],
    discountRate: 0.15,
    riskScore: 5,
    strategicScore: 2,
    description: 'High-risk deep space temperature gauge. Shows negative NPV at 15% discount rate (demonstrates value rejection).'
  }
];

export const DEFAULT_BUDGET = 500000; // ₹5,00,000 default capital budget
export const DEFAULT_MAX_PROJECTS = 3; // 3 projects default maximum to select
