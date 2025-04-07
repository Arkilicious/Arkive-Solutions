
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Faculty, Department, Level, Semester, Course, Question, ChatRoom, ChatMessage, StudyBuddy } from '@/types';
import { useAuth } from './AuthContext';

interface DataContextType {
  faculties: Faculty[];
  departments: Department[];
  levels: Level[];
  semesters: Semester[];
  courses: Course[];
  questions: Record<string, Question[]>;
  chatRooms: ChatRoom[];
  chatMessages: Record<string, ChatMessage[]>;
  studyBuddies: StudyBuddy[];
  isLoading: boolean;
  getCoursesForDepartment: (departmentId: string, level: string, semester: string) => Course[];
  getQuestionsForCourse: (courseId: string) => Question[];
  getCourse: (courseId: string) => Course | undefined;
  getCoursesByIds: (courseIds: string[]) => Course[];
  getFaculty: (id: string) => Faculty | undefined;
  getDepartment: (id: string) => Department | undefined;
  getChatRoomMessages: (roomId: string) => ChatMessage[];
  addChatMessage: (roomId: string, content: string) => void;
  findStudyBuddies: () => StudyBuddy[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockFaculties: Faculty[] = [
  { id: "fac-1", name: "Science and Technology" },
  { id: "fac-2", name: "Arts and Humanities" },
  { id: "fac-3", name: "Social Sciences" },
  { id: "fac-4", name: "Engineering" },
  { id: "fac-5", name: "Medical Sciences" },
];

const mockDepartments: Department[] = [
  { id: "dept-1", name: "Computer Science", facultyId: "fac-1" },
  { id: "dept-2", name: "Physics", facultyId: "fac-1" },
  { id: "dept-3", name: "English", facultyId: "fac-2" },
  { id: "dept-4", name: "History", facultyId: "fac-2" },
  { id: "dept-5", name: "Economics", facultyId: "fac-3" },
  { id: "dept-6", name: "Political Science", facultyId: "fac-3" },
  { id: "dept-7", name: "Mechanical Engineering", facultyId: "fac-4" },
  { id: "dept-8", name: "Civil Engineering", facultyId: "fac-4" },
  { id: "dept-9", name: "Medicine", facultyId: "fac-5" },
  { id: "dept-10", name: "Pharmacy", facultyId: "fac-5" },
];

const mockLevels: Level[] = [
  { id: "level-1", name: "100 Level", value: "100" },
  { id: "level-2", name: "200 Level", value: "200" },
  { id: "level-3", name: "300 Level", value: "300" },
  { id: "level-4", name: "400 Level", value: "400" },
  { id: "level-5", name: "500 Level", value: "500" },
];

const mockSemesters: Semester[] = [
  { id: "sem-1", name: "First Semester", value: "first" },
  { id: "sem-2", name: "Second Semester", value: "second" },
];

const mockCourses: Course[] = [
  { 
    id: "course-1", 
    code: "CSC101", 
    title: "Introduction to Computer Science", 
    departmentId: "dept-1", 
    level: "100", 
    semester: "first",
    questionCount: 25 
  },
  { 
    id: "course-2", 
    code: "CSC102", 
    title: "Introduction to Programming", 
    departmentId: "dept-1", 
    level: "100", 
    semester: "second",
    questionCount: 30 
  },
  { 
    id: "course-3", 
    code: "CSC201", 
    title: "Data Structures", 
    departmentId: "dept-1", 
    level: "200", 
    semester: "first",
    questionCount: 20 
  },
  { 
    id: "course-4", 
    code: "CSC301", 
    title: "Database Systems", 
    departmentId: "dept-1", 
    level: "300", 
    semester: "first",
    questionCount: 15 
  },
  { 
    id: "course-5", 
    code: "PHY101", 
    title: "General Physics I", 
    departmentId: "dept-2", 
    level: "100", 
    semester: "first",
    questionCount: 35 
  },
  { 
    id: "course-6", 
    code: "GSS101", 
    title: "Use of English", 
    departmentId: "dept-3", 
    level: "100", 
    semester: "first",
    questionCount: 40 
  },
  { 
    id: "course-7", 
    code: "GSS102", 
    title: "Philosophy and Logic", 
    departmentId: "dept-3", 
    level: "100", 
    semester: "second",
    questionCount: 30 
  },
  { 
    id: "course-8", 
    code: "GSS201", 
    title: "Peace Studies and Conflict Resolution", 
    departmentId: "dept-3", 
    level: "200", 
    semester: "first",
    questionCount: 25 
  },
];

// Generate mock questions
const generateMockQuestions = (): Record<string, Question[]> => {
  const questions: Record<string, Question[]> = {};
  
  mockCourses.forEach(course => {
    questions[course.id] = Array.from({ length: 10 }, (_, i) => ({
      id: `q-${course.id}-${i+1}`,
      courseId: course.id,
      year: `${2020 + Math.floor(Math.random() * 5)}`,
      content: `Sample question ${i+1} for ${course.code}: What is the correct answer to this ${course.title.toLowerCase()} question?`,
      options: {
        a: "Option A explanation",
        b: "Option B explanation",
        c: "Option C explanation",
        d: "Option D explanation",
      },
      answer: ["a", "b", "c", "d"][Math.floor(Math.random() * 4)],
      explanation: "This is the explanation for the correct answer."
    }));
  });
  
  return questions;
};

const mockChatRooms: ChatRoom[] = [
  { id: "room-1", name: "Science and Technology", type: "faculty", entityId: "fac-1" },
  { id: "room-2", name: "Computer Science", type: "department", entityId: "dept-1" },
  { id: "room-3", name: "300 Level Computer Science", type: "level", entityId: "300" },
];

const generateMockChatMessages = (): Record<string, ChatMessage[]> => {
  const messages: Record<string, ChatMessage[]> = {};
  
  mockChatRooms.forEach(room => {
    messages[room.id] = Array.from({ length: 10 }, (_, i) => ({
      id: `msg-${room.id}-${i+1}`,
      roomId: room.id,
      userId: `user-${i % 5 + 1}`,
      userName: `Student ${i % 5 + 1}`,
      content: `This is a sample message ${i+1} in the ${room.name} chat room.`,
      timestamp: new Date(Date.now() - i * 600000).toISOString()
    }));
  });
  
  return messages;
};

const mockStudyBuddies: StudyBuddy[] = [
  {
    userId: "buddy-1",
    name: "Emma Johnson",
    avatar: undefined,
    faculty: "Science and Technology",
    department: "Computer Science",
    level: "300",
    interests: ["Programming", "AI", "Web Development"],
    status: "available"
  },
  {
    userId: "buddy-2",
    name: "Michael Chen",
    avatar: undefined,
    faculty: "Science and Technology",
    department: "Computer Science",
    level: "300",
    interests: ["Databases", "Machine Learning", "Mobile Development"],
    status: "available"
  },
  {
    userId: "buddy-3",
    name: "Sophia Garcia",
    avatar: undefined,
    faculty: "Science and Technology",
    department: "Computer Science",
    level: "200",
    interests: ["Algorithms", "Data Structures", "Cybersecurity"],
    status: "offline"
  },
  {
    userId: "buddy-4",
    name: "David Okafor",
    avatar: undefined,
    faculty: "Science and Technology",
    department: "Physics",
    level: "300",
    interests: ["Quantum Computing", "Theoretical Physics"],
    status: "busy"
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
  const [studyBuddies, setStudyBuddies] = useState<StudyBuddy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls to fetch data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setFaculties(mockFaculties);
        setDepartments(mockDepartments);
        setLevels(mockLevels);
        setSemesters(mockSemesters);
        setCourses(mockCourses);
        setQuestions(generateMockQuestions());
        setChatRooms(mockChatRooms);
        setChatMessages(generateMockChatMessages());
        setStudyBuddies(mockStudyBuddies);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCoursesForDepartment = (departmentId: string, level: string, semester: string) => {
    return courses.filter(course => 
      course.departmentId === departmentId && 
      course.level === level && 
      course.semester === semester
    );
  };

  const getQuestionsForCourse = (courseId: string) => {
    return questions[courseId] || [];
  };

  const getCourse = (courseId: string) => {
    return courses.find(course => course.id === courseId);
  };

  const getCoursesByIds = (courseIds: string[]) => {
    return courses.filter(course => courseIds.includes(course.id));
  };

  const getFaculty = (id: string) => {
    return faculties.find(faculty => faculty.id === id);
  };

  const getDepartment = (id: string) => {
    return departments.find(department => department.id === id);
  };

  const getChatRoomMessages = (roomId: string) => {
    return chatMessages[roomId] || [];
  };

  const addChatMessage = (roomId: string, content: string) => {
    if (!user) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${roomId}-${Date.now()}`,
      roomId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => ({
      ...prev,
      [roomId]: [newMessage, ...(prev[roomId] || [])]
    }));
  };

  const findStudyBuddies = () => {
    // In a real app, this would filter based on user's faculty, department, level, etc.
    return studyBuddies;
  };

  return (
    <DataContext.Provider value={{
      faculties,
      departments,
      levels,
      semesters,
      courses,
      questions,
      chatRooms,
      chatMessages,
      studyBuddies,
      isLoading,
      getCoursesForDepartment,
      getQuestionsForCourse,
      getCourse,
      getCoursesByIds,
      getFaculty,
      getDepartment,
      getChatRoomMessages,
      addChatMessage,
      findStudyBuddies
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
