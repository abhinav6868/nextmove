import { getConfig } from "@/lib/db/queries";
import { SettingsView } from "@/components/settings/settings-view";
import { DEFAULT_CONFIG, NextmoveConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const top_n = (await getConfig<number>("top_n")) || DEFAULT_CONFIG.top_n;
  const weights = (await getConfig<NextmoveConfig["weights"]>("weights")) || DEFAULT_CONFIG.weights;
  const icp = (await getConfig<NextmoveConfig["icp"]>("icp")) || DEFAULT_CONFIG.icp;

  return (
    <SettingsView
      initialConfig={{
        top_n,
        weights,
        icp,
      }}
    />
  );
}
