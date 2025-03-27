export interface TaskItemDto {
    id: string;
    title: string;
    description: string;
    createdBy: string;
    assignedTo: string;
    createdDate: string; // or Date if you're parsing it
    startDate: string;   // or Date
    endDate: string;     // or Date
    status: string;
  }

export interface TaskItemCreateDto{
    title: string;
    description: string;
    // createdBy: string;       // or Guid as string
    assignedTo: string;      // Guid
    startDate: string;       // ISO date string or Date
    endDate: string;         // ISO date string or Date
}