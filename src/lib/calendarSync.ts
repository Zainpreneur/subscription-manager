import type { Subscription } from '../types/subscription';

export function generateICS(subs: Subscription[]): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SubManager//EN', 'CALSCALE:GREGORIAN'];
  subs.forEach((s) => {
    const d = s.renewalDate.replace(/-/g, '');
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${s.id}@submanager`);
    lines.push(`DTSTART;VALUE=DATE:${d}`);
    lines.push(`DTEND;VALUE=DATE:${d}`);
    lines.push(`SUMMARY:${s.name} renewal (${s.cost} ${s.currency})`);
    lines.push(`DESCRIPTION:Vendor: ${s.vendor}\\nCategory: ${s.category}\\nCycle: ${s.billingCycle}\\nAuto-renew: ${s.autoRenew}`);
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(subs: Subscription[], filename = 'submanager-renewals.ics') {
  const blob = new Blob([generateICS(subs)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
