/**
 * Formats a number as Indian Rupees (INR)
 * @param amount - The amount to format
 * @returns Formatted currency string with ₹ symbol
 */
export function formatINR(amount: number): string {
  return `₹${amount.toFixed(2)}`
}

/**
 * Formats a number as Indian Rupees with Indian numbering system (lakhs/crores)
 * @param amount - The amount to format
 * @returns Formatted currency string with ₹ symbol and Indian number format
 */
export function formatINRIndian(amount: number): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  return formatted
}

/**
 * Alias for formatINRIndian - formats currency with proper Indian numbering
 * @param amount - The amount to format
 * @returns Formatted currency string with ₹ symbol
 */
export function formatCurrency(amount: number): string {
  return formatINRIndian(amount)
}

