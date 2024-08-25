const defaultLocale = "en-IN";
const currencyStyle = {
  maximumFractionDigits: 0,
  notation: "standard",
  compactDisplay: "short",
  style: "currency",
  currency: "INR"
};

export const formatNumber = (value: number, notation?: string): string => {
  try {
    const options: any = {
      ...currencyStyle,
      notation: notation ?? currencyStyle.notation
    };
    return new Intl.NumberFormat(defaultLocale, options).format(value);
  } catch (error) {
    return "";
  }
};

export const formatNumberForCharts = (value: number): string => {
  try {
    if (value >= 10000000) { // 1 crore or more
      const crores = value / 10000000;
      return `₹${crores}Cr`;
    } else if (value >= 100000) { // 1 lakh or more
      const lakhs = value / 100000;
      return `₹${lakhs}L`;
    } else {
      // For values less than 1 lakh, use the default formatting
      const options: Intl.NumberFormatOptions = {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      };
      return new Intl.NumberFormat('en-IN', options).format(value);
    }
  } catch (error) {
    return "";
  }
};