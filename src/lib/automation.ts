import { useApiKeyStore } from '../store/useApiKeyStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { alertService } from '../services/alertService';
import { daysUntil } from './utils';

export async function runAutomations() {
  // Auto-pause expired trial API keys
  const keyStore = useApiKeyStore.getState();
  await keyStore.fetchAll();
  const keys = useApiKeyStore.getState().keys;
  for (const k of keys) {
    if (k.type === 'trial' && k.status === 'active' && k.expiresAt && daysUntil(k.expiresAt) < 0) {
      await keyStore.update(k.id, { status: 'expired' });
      await alertService.create({ type: 'expiry', severity: 'warning', title: 'Trial key auto-expired', message: `${k.name} (${k.service}) expired and was marked expired.`, link: '/api-keys' });
    }
  }

  // Renewal reminders
  const subStore = useSubscriptionStore.getState();
  await subStore.fetchAll();
  const subs = useSubscriptionStore.getState().subscriptions;
  for (const s of subs) {
    if (s.status === 'active') {
      const d = daysUntil(s.renewalDate);
      if (d >= 0 && d <= 7) {
        await alertService.create({ type: 'renewal', severity: d <= 2 ? 'critical' : 'warning', title: `Renewal in ${d} day${d === 1 ? '' : 's'}`, message: `${s.name} renews on ${s.renewalDate} for ${s.cost}.`, link: '/subscriptions' });
      }
    }
  }


}
