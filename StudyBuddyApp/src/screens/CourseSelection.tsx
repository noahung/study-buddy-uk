import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, theme, layout, spacing, borderRadius } from '../styles';
import { Search, BookOpen, Award, Clock } from 'lucide-react-native';

interface Course {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  students: number;
  rating: number;
}

interface CourseSelectionProps {
  onCourseSelect: (course: Course) => void;
}

// Sample course data based on PRD
const courseCategories = [
  {
    name: 'Finance & Banking',
    icon: '💰',
    courses: [
      {
        id: 'cemap',
        name: 'CeMAP – Certificate in Mortgage Advice',
        category: 'Finance & Banking',
        difficulty: 'Intermediate' as const,
        duration: '6-8 weeks',
        students: 1200,
        rating: 4.8,
      },
      {
        id: 'dipfa',
        name: 'DipFA – Diploma for Financial Advisers',
        category: 'Finance & Banking',
        difficulty: 'Advanced' as const,
        duration: '12-16 weeks',
        students: 980,
        rating: 4.7,
      },
      {
        id: 'cfa',
        name: 'CFA – Chartered Financial Analyst',
        category: 'Finance & Banking',
        difficulty: 'Advanced' as const,
        duration: '20-24 weeks',
        students: 2500,
        rating: 4.9,
      },
    ]
  },
  {
    name: 'IT & Cybersecurity',
    icon: '🔐',
    courses: [
      {
        id: 'comptia-a+',
        name: 'CompTIA A+',
        category: 'IT & Cybersecurity',
        difficulty: 'Beginner' as const,
        duration: '4-6 weeks',
        students: 3200,
        rating: 4.6,
      },
      {
        id: 'aws-solutions',
        name: 'AWS Certified Solutions Architect',
        category: 'IT & Cybersecurity',
        difficulty: 'Intermediate' as const,
        duration: '8-10 weeks',
        students: 2100,
        rating: 4.8,
      },
    ]
  },
  {
    name: 'Law & Compliance',
    icon: '⚖️',
    courses: [
      {
        id: 'cilex',
        name: 'CILEx – Chartered Institute of Legal Executives',
        category: 'Law & Compliance',
        difficulty: 'Advanced' as const,
        duration: '16-20 weeks',
        students: 850,
        rating: 4.5,
      },
      {
        id: 'sqe',
        name: 'SQE – Solicitors Qualifying Exam',
        category: 'Law & Compliance',
        difficulty: 'Advanced' as const,
        duration: '24-30 weeks',
        students: 1500,
        rating: 4.7,
      },
    ]
  },
];

const CourseSelection: React.FC<CourseSelectionProps> = ({ onCourseSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState(courseCategories[0].name);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCourses = courseCategories.find(cat => cat.name === selectedCategory)?.courses || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return colors.green[500];
      case 'Intermediate': return colors.yellow[600];
      case 'Advanced': return colors.red[500];
      default: return colors.gray[500];
    }
  };

  const renderCourse = ({ item }: { item: Course }) => (
    <Card
      onPress={() => onCourseSelect(item)}
      style={{
        marginBottom: spacing[4],
        padding: spacing[5],
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing[3] }}>
        <View style={{ flex: 1, marginRight: spacing[3] }}>
          <Text variant="h3" style={{ marginBottom: spacing[1] }}>
            {item.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
            <View
              style={{
                backgroundColor: getDifficultyColor(item.difficulty),
                paddingHorizontal: spacing[2],
                paddingVertical: spacing[1],
                borderRadius: borderRadius.sm,
              }}
            >
              <Text variant="caption" color="white" style={{ fontSize: 12 }}>
                {item.difficulty}
              </Text>
            </View>
            <Text variant="caption" color="secondary">
              ⭐ {item.rating} • {item.students.toLocaleString()} students
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[4] }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
            <Clock size={16} color={theme.text.tertiary} />
            <Text variant="caption" color="tertiary">
              {item.duration}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[1] }}>
            <BookOpen size={16} color={theme.text.tertiary} />
            <Text variant="caption" color="tertiary">
              Professional Cert
            </Text>
          </View>
        </View>
        
        <Award size={20} color={colors.yellow[500]} />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[layout.container, { backgroundColor: theme.background }]}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{ padding: spacing[6], paddingBottom: spacing[4] }}>
        <Text variant="h1" style={{ marginBottom: spacing[2] }}>
          Choose Your Course
        </Text>
        <Text variant="body" color="secondary">
          Select a professional certification to begin your learning journey
        </Text>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: spacing[6],
          paddingBottom: spacing[4],
        }}
      >
        {courseCategories.map((category) => (
          <TouchableOpacity
            key={category.name}
            onPress={() => setSelectedCategory(category.name)}
            style={{
              backgroundColor: selectedCategory === category.name ? theme.primary : colors.gray[100],
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[3],
              borderRadius: borderRadius.lg,
              marginRight: spacing[3],
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing[2],
            }}
          >
            <Text style={{ fontSize: 18 }}>{category.icon}</Text>
            <Text
              variant="label"
              color={selectedCategory === category.name ? "white" : "primary"}
              style={{ fontSize: 14 }}
            >
              {category.name.split(' & ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Course List */}
      <FlatList
        data={selectedCourses}
        renderItem={renderCourse}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: spacing[6],
          paddingTop: spacing[2],
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom CTA */}
      <View
        style={{
          padding: spacing[6],
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.gray[200],
        }}
      >
        <Text variant="caption" color="secondary" style={{ textAlign: 'center', marginBottom: spacing[3] }}>
          Can't find your course? We're adding new certifications regularly.
        </Text>
        <Button variant="outline">
          <Text variant="label">Request a Course</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default CourseSelection;