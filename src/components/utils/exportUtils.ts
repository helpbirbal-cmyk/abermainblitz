// utils/exportUtils.ts
export const generatePDFReport = (data: any, calculatorType: string) => {
  // Implementation for PDF generation
  console.log('Generating PDF report for:', calculatorType, data);
};

export const exportToCSV = (data: any) => {
  const csvContent = Object.entries(data)
    .map(([key, value]) => `${key},${value}`)
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'roi-analysis.csv';
  link.click();
};

export const shareResults = async (data: any) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'ROI Analysis Results',
        text: `Check out these potential savings: $${data.totalSavings}`,
        url: window.location.href
      });
    } catch (error) {
      console.log('Sharing failed', error);
    }
  }
};
