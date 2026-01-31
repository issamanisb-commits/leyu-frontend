/**
 * Formats an ISO date string to a human-readable format
 * @param isoDate - The ISO date string (e.g., "2025-05-22T00:00:00.000Z")
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDateMedium = (isoDate: string, style: string = 'medium') => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return 'Invalid date';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: style === 'short' ? 'numeric' : 'short',
    day: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
};
export function formatDate(
    isoDate: string,
    options: {
        style?: 'short' | 'medium' | 'long' | 'full' | 'custom';
        format?: string; // Only used when style is 'custom'
        locale?: string;
    } = { style: 'medium', locale: 'en-US' }
): string {
    const date = new Date(isoDate);

    if (isNaN(date.getTime())) {
        console.error('Invalid date provided:', isoDate);
        return 'Invalid date';
    }

    const { style = 'medium', format, locale = 'en-US' } = options;

    if (style === 'custom' && format) {
        // For custom formatting using Intl.DateTimeFormat
        return new Intl.DateTimeFormat(locale, {
            year: format.includes('y') ? 'numeric' : undefined,
            month: format.includes('M') ? format.match(/M+/)?.[0].length === 1 ? 'numeric' : 'long' : undefined,
            day: format.includes('d') ? 'numeric' : undefined,
            // Add more options as needed
        }).format(date);
    }

    const formatOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    switch (style) {
        case 'short':
            return date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            }); // "5/22/2025"
        case 'medium':
            return date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }); // "May 22, 2025"
        case 'long':
            return date.toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }); // "May 22, 2025"
        case 'full':
            return date.toLocaleDateString(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }); // "Thursday, May 22, 2025"
        default:
            return date.toLocaleDateString(locale, formatOptions);
    }
}

// Additional utility functions
export function formatDateTime(isoDate: string): string {
    return new Date(isoDate).toLocaleString();
}

export function formatTime(isoDate: string): string {
    return new Date(isoDate).toLocaleTimeString();
}

export function isFutureDate(isoDate: string): boolean {
    return new Date(isoDate) > new Date();
}