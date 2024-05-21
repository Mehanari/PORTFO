import { PortfolioStatus } from "@/portfolioStatuses";


  // Add a mapping of the enum values to their corresponding names
  const PortfolioStatusNames: Record<PortfolioStatus, string> = {
    [PortfolioStatus.DRAFT]: 'Draft',
    [PortfolioStatus.PUBLISHED]: 'Published',
    [PortfolioStatus.PENDING_CHANGES]: 'Pending changes',
  };


  // Function to get the status name based on the number
export const getStatusName = (statusId: number): string => {
  return PortfolioStatusNames[statusId as PortfolioStatus] || 'Unknown Status';
};




  