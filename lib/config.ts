export interface NextmoveConfig {
  top_n: number;
  weights: {
    timing: number;
    fit: number;
    reach: number;
    base_factor: number;
    confidence_factor: number;
  };
  icp: {
    target: string;
    stage_bands: string[];
    size_bands: string[];
    location: string;
    business_model: string;
  };
}

export const DEFAULT_CONFIG: NextmoveConfig = {
  top_n: 10, // Switchable to 5 in Focus mode
  weights: {
    timing: 0.35,
    fit: 0.35,
    reach: 0.30,
    base_factor: 0.6,
    confidence_factor: 0.4,
  },
  icp: {
    target: "Solo seller of AI automation services",
    stage_bands: ["Seed", "Series A", "Series B"],
    size_bands: ["20-50", "50-200"],
    location: "Bengaluru, India",
    business_model: "B2B SaaS",
  },
};
