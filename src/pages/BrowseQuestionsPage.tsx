
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, Search, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const BrowseQuestionsPage: React.FC = () => {
  const { faculties, departments, levels, semesters, courses } = useData();
  
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredCourses, setFilteredCourses] = useState<typeof courses>([]);

  // Filter departments based on selected faculty
  const availableDepartments = departments.filter(
    dept => selectedFaculty ? dept.facultyId === selectedFaculty : true
  );

  // Reset department when faculty changes
  useEffect(() => {
    setSelectedDepartment('');
  }, [selectedFaculty]);

  // Update filtered courses when filters change
  useEffect(() => {
    let filtered = [...courses];
    
    if (selectedDepartment) {
      filtered = filtered.filter(course => course.departmentId === selectedDepartment);
    } else if (selectedFaculty) {
      const deptIds = departments
        .filter(dept => dept.facultyId === selectedFaculty)
        .map(dept => dept.id);
      filtered = filtered.filter(course => deptIds.includes(course.departmentId));
    }
    
    if (selectedLevel) {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }
    
    if (selectedSemester) {
      filtered = filtered.filter(course => course.semester === selectedSemester);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.code.toLowerCase().includes(query) || 
        course.title.toLowerCase().includes(query)
      );
    }
    
    setFilteredCourses(filtered);
  }, [selectedFaculty, selectedDepartment, selectedLevel, selectedSemester, searchQuery, courses, departments]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Browse Past Questions</h1>
        <p className="text-muted-foreground mt-2">
          Filter by faculty, department, level, and semester to find past questions
        </p>
      </header>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Questions</CardTitle>
          <CardDescription>
            Use the filters below to find exactly what you're looking for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Faculty</label>
              <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                <SelectTrigger>
                  <SelectValue placeholder="All Faculties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Faculties</SelectItem>
                  {faculties.map(faculty => (
                    <SelectItem key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
                disabled={availableDepartments.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  {availableDepartments.map(department => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level.id} value={level.value}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Semester</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Semesters</SelectItem>
                  {semesters.map(semester => (
                    <SelectItem key={semester.id} value={semester.value}>
                      {semester.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by course code or title"
              className="pl-10"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {filteredCourses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map(course => (
            <Card key={course.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{course.code}</CardTitle>
                    <CardDescription className="mt-1">{course.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex justify-between items-center text-sm">
                  <span>{course.questionCount} questions</span>
                  <span className="text-muted-foreground">{course.level} Level</span>
                </div>
              </CardContent>
              <div className="border-t p-3 bg-muted/50">
                <Link to={`/course/${course.id}`}>
                  <Button className="w-full">
                    View Questions <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search query
          </p>
          <Button onClick={() => {
            setSelectedFaculty('');
            setSelectedDepartment('');
            setSelectedLevel('');
            setSelectedSemester('');
            setSearchQuery('');
          }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default BrowseQuestionsPage;
