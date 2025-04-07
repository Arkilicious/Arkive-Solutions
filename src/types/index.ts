
export interface User {
  id: string;
  name: string;
  email: string;
  faculty: string;
  department: string;
  level: string;
  courses: string[];
  isSubscribed: boolean;
  avatar?: string;
  createdAt: string;
}

export interface Faculty {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  facultyId: string;
}

export interface Level {
  id: string;
  name: string;
  value: string; // "100", "200", etc.
}

export interface Semester {
  id: string;
  name: string;
  value: string; // "first", "second"
}

export interface Course {
  id: string;
  code: string; // e.g. "CSC101"
  title: string;
  departmentId: string;
  level: string;
  semester: string;
  questionCount: number;
}

export interface Question {
  id: string;
  courseId: string;
  year: string;
  content: string;
  options?: {
    a: string;
    b: string;
    c: string;
    d: string;
    [key: string]: string;
  };
  answer: string;
  explanation?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: "faculty" | "department" | "level";
  entityId: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
}

export interface StudyBuddy {
  userId: string;
  name: string;
  avatar?: string;
  faculty: string;
  department: string;
  level: string;
  interests?: string[];
  status: "available" | "busy" | "offline";
}

export interface CBTSession {
  id: string;
  courseId: string;
  courseName: string;
  userId: string;
  questions: Question[];
  answers: Record<string, string>;
  score?: number;
  completed: boolean;
  startTime: string;
  endTime?: string;
}
