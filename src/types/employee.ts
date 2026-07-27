 export interface Employee {
  _id: number;
  employeeId: number;
  name: string; 
  email: string;
  phone: string;
  department: string;
  salary: string;
  experience: string;
  skills: {
  name: string;
  level: number;
}[];
  company: string;
}