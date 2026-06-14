'use client';

import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import AccessibilityToolbar from '@/components/AccessibilityToolbar';
import OfflineBanner from '@/components/OfflineBanner';
import DisguiseOverlay from '@/components/DisguiseOverlay';
import { useDisguiseMode } from '@/lib/useDisguiseMode';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { enabled, revealed, loaded, enable, disable, reveal } = useDisguiseMode();

  if (loaded && enabled && !revealed) {
    return <DisguiseOverlay onReveal={reveal} />;
  }

  return (
    <>
      <SiteHeader />
      <OfflineBanner />
      <div className="flex-1">{children}</div>
      <SiteFooter />
      <AccessibilityToolbar
        disguiseEnabled={enabled}
        onEnableDisguise={enable}
        onDisableDisguise={disable}
      />
    </>
  );
}
