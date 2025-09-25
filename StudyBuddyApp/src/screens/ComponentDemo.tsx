import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Text } from '../components/ui/Text';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { layout, spacing, theme } from '../styles';
import StudyBuddyApp from '../StudyBuddyApp';

const ComponentDemo: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'demo' | 'app'>('demo');

  if (currentScreen === 'app') {
    return <StudyBuddyApp />;
  }

  return (
    <View style={layout.container}>
      <StatusBar style="auto" />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ 
          padding: spacing[6],
          paddingTop: spacing[12] 
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: spacing[8] }}>
          <Text variant="h1" style={{ marginBottom: spacing[2] }}>
            Study Buddy
          </Text>
          <Text variant="body" color="secondary">
            Neumorphic React Native Components
          </Text>
        </View>

        {/* App Navigation */}
        <Card style={{ marginBottom: spacing[6] }}>
          <Text variant="h3" style={{ marginBottom: spacing[4] }}>
            Full App Demo
          </Text>
          <View style={{ gap: spacing[3] }}>
            <Button onPress={() => setCurrentScreen('app')}>
              <Text variant="label" color="white">Open Study Buddy App</Text>
            </Button>
          </View>
        </Card>

        {/* Simple Button Test */}
        <Card style={{ marginBottom: spacing[6] }}>
          <Text variant="h3" style={{ marginBottom: spacing[4] }}>
            Buttons
          </Text>
          <View style={{ gap: spacing[3] }}>
            <Button>
              <Text variant="label" color="white">Primary Button</Text>
            </Button>
            
            <Button variant="secondary">
              <Text variant="label">Secondary Button</Text>
            </Button>
          </View>
        </Card>

        {/* Simple Card Test */}
        <Card variant="elevated" style={{ marginBottom: spacing[6] }}>
          <Text variant="h3" style={{ marginBottom: spacing[2] }}>
            Neumorphic Card
          </Text>
          <Text variant="body" color="secondary">
            This card demonstrates the soft UI shadow effects that we've adapted for React Native.
          </Text>
        </Card>

        {/* Input Test */}
        <Card style={{ marginBottom: spacing[6] }}>
          <Text variant="h3" style={{ marginBottom: spacing[4] }}>
            Input Components
          </Text>
          <View style={{ gap: spacing[3] }}>
            {/* We'll add Input component later when icons are working */}
            <Text variant="body" color="secondary">
              Input components coming soon...
            </Text>
          </View>
        </Card>

        {/* Typography Test */}
        <Card style={{ marginBottom: spacing[6] }}>
          <Text variant="h3" style={{ marginBottom: spacing[4] }}>
            Typography System
          </Text>
          <View style={{ gap: spacing[2] }}>
            <Text variant="h1">Heading 1</Text>
            <Text variant="h2">Heading 2</Text>
            <Text variant="body">Body text for content</Text>
            <Text variant="caption">Caption text</Text>
            <Text variant="label">Label text</Text>
          </View>
        </Card>

        <View style={{ height: spacing[12] }} />
      </ScrollView>
    </View>
  );
};

export default ComponentDemo;