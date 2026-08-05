/**
 * Formats time string (either ISO format "2026-08-01T16:50:00+05:30" or "16:50")
 * into clean 12-hour format "4:50 PM" or "16:50".
 */
export function formatTime(timeStr?: string | null, use12Hour: boolean = true): string {
  if (!timeStr) return '--:--';
  
  try {
    // Check if ISO string
    if (timeStr.includes('T')) {
      const date = new Date(timeStr);
      if (!isNaN(date.getTime())) {
        if (use12Hour) {
          return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
        }
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }
    
    // Check HH:MM format
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      if (use12Hour) {
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        const displayM = String(m).padStart(2, '0');
        return `${displayH}:${displayM} ${period}`;
      }
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
  } catch (e) {
    // fallback
  }

  return timeStr;
}

/**
 * Formats ISO date string to readable date "Sat, 1 Aug"
 */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  } catch (e) {}
  return dateStr;
}
