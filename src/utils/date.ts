export function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `prije ${days} ${days === 1 ? 'dan' : 'dana'}`;
  } else if (hours > 0) {
    return `prije ${hours} ${hours === 1 ? 'sat' : hours < 5 ? 'sata' : 'sati'}`;
  } else if (minutes > 0) {
    return `prije ${minutes} ${minutes === 1 ? 'minutu' : minutes < 5 ? 'minute' : 'minuta'}`;
  } else {
    return 'upravo sada';
  }
}