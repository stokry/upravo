import { formatDistanceToNow } from 'date-fns';
import { hr } from 'date-fns/locale';

export function formatTimeAgo(date: string) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: hr,
  });
}