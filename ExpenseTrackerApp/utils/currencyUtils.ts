export const formatCurrency = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export const parseCurrency = (currencyString: string): number => {
  return Number.parseFloat(currencyString.replace(/[^0-9.-]+/g, ""))
}

export const calculatePercentage = (part: number, total: number): string => {
  if (total === 0) return "0"
  return ((part / total) * 100).toFixed(1)
}

export const calculateTotal = (items: any[], field = "amount"): number => {
  return items.reduce((total, item) => total + (item[field] || 0), 0)
}
