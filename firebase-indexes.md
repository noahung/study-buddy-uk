# Firebase Firestore Indexes Required for Study Buddy UK

This document lists all the Firestore indexes you need to create for optimal performance of the Study Buddy mobile app.

## 📋 Index Creation Methods

### Method 1: Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Firestore Database → Indexes
4. Click "Create Index"
5. Add the fields and configurations listed below

### Method 2: Firebase CLI
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy indexes
firebase deploy --only firestore:indexes
```

## 🗂️ Required Indexes

### 1. Notes Collection

#### Index 1: User Notes by Update Time
- **Collection**: `notes`
- **Fields**:
  - `createdBy` (Ascending)
  - `updatedAt` (Descending)
- **Query**: Get user's notes ordered by most recent update

#### Index 2: User Notes by Course and Update Time
- **Collection**: `notes`
- **Fields**:
  - `createdBy` (Ascending)
  - `courseId` (Ascending)
  - `updatedAt` (Descending)
- **Query**: Get user's notes for specific course ordered by most recent update

#### Index 3: Note Templates by Usage
- **Collection**: `noteTemplates`
- **Fields**:
  - `usageCount` (Descending)
- **Query**: Get most popular note templates

### 2. Flashcard Sets Collection

#### Index 4: User Flashcard Sets by Update Time
- **Collection**: `flashcardSets`
- **Fields**:
  - `createdBy` (Ascending)
  - `updatedAt` (Descending)
- **Query**: Get user's flashcard sets ordered by most recent update

#### Index 5: User Flashcard Sets by Course and Update Time
- **Collection**: `flashcardSets`
- **Fields**:
  - `createdBy` (Ascending)
  - `courseId` (Ascending)
  - `updatedAt` (Descending)
- **Query**: Get user's flashcard sets for specific course ordered by most recent update

### 3. Flashcards Collection

#### Index 6: Flashcards by Set and Creation Time
- **Collection**: `flashcards`
- **Fields**:
  - `setId` (Ascending)
  - `createdAt` (Ascending)
- **Query**: Get flashcards in a set ordered by creation time

### 4. Study Sessions Collection

#### Index 7: Study Sessions by User
- **Collection**: `studySessions`
- **Fields**:
  - `userId` (Ascending)
- **Query**: Get study sessions for a specific user

### 5. Flashcard Progress Collection

#### Index 8: Flashcard Progress by User
- **Collection**: `flashcardProgress`
- **Fields**:
  - `userId` (Ascending)
- **Query**: Get flashcard progress for a specific user

### 6. Courses Collection

#### Index 9: Courses by Creation Time
- **Collection**: `courses`
- **Fields**:
  - `createdAt` (Descending)
- **Query**: Get all courses ordered by most recent creation

#### Index 10: Courses by Category and Creation Time
- **Collection**: `courses`
- **Fields**:
  - `category` (Ascending)
  - `createdAt` (Descending)
- **Query**: Get courses by category ordered by most recent creation

### 7. User Progress Collection

#### Index 11: User Progress by User
- **Collection**: `userProgress`
- **Fields**:
  - `userId` (Ascending)
- **Query**: Get user progress for a specific user

### 8. Lessons Collection

#### Index 12: Lessons by Course and Order
- **Collection**: `lessons`
- **Fields**:
  - `courseId` (Ascending)
  - `order` (Ascending)
- **Query**: Get lessons for a course ordered by sequence

### 9. Quizzes Collection

#### Index 13: Quizzes by Course and Creation Time
- **Collection**: `quizzes`
- **Fields**:
  - `courseId` (Ascending)
  - `createdAt` (Ascending)
- **Query**: Get quizzes for a course ordered by creation time

### 10. Quiz Attempts Collection

#### Index 14: Quiz Attempts by User
- **Collection**: `quizAttempts`
- **Fields**:
  - `userId` (Ascending)
- **Query**: Get quiz attempts for a specific user

#### Index 15: Quiz Attempts by User and Quiz
- **Collection**: `quizAttempts`
- **Fields**:
  - `userId` (Ascending)
  - `quizId` (Ascending)
- **Query**: Get quiz attempts for a specific user and quiz

## 🚀 Additional Recommended Indexes

### For Future Features (Optional)

#### Index 16: Notes by Tags (if implementing tag search)
- **Collection**: `notes`
- **Fields**:
  - `createdBy` (Ascending)
  - `tags` (Arrays)
  - `updatedAt` (Descending)

#### Index 17: Flashcards by Difficulty (if implementing difficulty filtering)
- **Collection**: `flashcards`
- **Fields**:
  - `setId` (Ascending)
  - `difficulty` (Ascending)
  - `createdAt` (Ascending)

#### Index 18: Study Sessions by Date Range (if implementing analytics)
- **Collection**: `studySessions`
- **Fields**:
  - `userId` (Ascending)
  - `startTime` (Ascending)

## 📊 Index Performance Tips

### 1. Composite Indexes
- Always create composite indexes for queries with multiple `where` clauses
- Order fields by selectivity (most selective first)

### 2. Range Queries
- For range queries (`>`, `<`, `>=`, `<=`), the range field should be the last field in the index

### 3. Array Fields
- Use `array-contains` for array field queries
- Create separate indexes for array field queries

### 4. Order By
- Include `orderBy` fields in the index
- For descending order, specify `desc` in the index

## 🔧 Firebase Console Setup Steps

1. **Open Firebase Console**
   - Go to [https://console.firebase.google.com](https://console.firebase.google.com)
   - Select your Study Buddy project

2. **Navigate to Firestore**
   - Click on "Firestore Database" in the left sidebar
   - Click on the "Indexes" tab

3. **Create Each Index**
   - Click "Create Index"
   - Select the collection name
   - Add fields in the correct order
   - Set field order (Ascending/Descending)
   - Click "Create"

4. **Monitor Index Status**
   - Indexes will show as "Building" initially
   - Wait for "Enabled" status before testing queries

## ⚠️ Important Notes

- **Index Building Time**: Large collections may take several minutes to build indexes
- **Storage Cost**: Each index uses additional storage space
- **Query Performance**: Without proper indexes, queries will fail or be slow
- **Testing**: Test queries in Firebase Console before deploying to production

## 🎯 Priority Order

Create indexes in this order for optimal development experience:

1. **High Priority** (Core functionality):
   - Index 1, 2 (Notes)
   - Index 4, 5 (Flashcard Sets)
   - Index 6 (Flashcards)
   - Index 9, 10 (Courses)

2. **Medium Priority** (Study features):
   - Index 7, 8 (Study Sessions, Progress)
   - Index 11 (User Progress)
   - Index 12, 13 (Lessons, Quizzes)

3. **Low Priority** (Analytics):
   - Index 14, 15 (Quiz Attempts)
   - Index 16-18 (Future features)

## 📱 Testing Your Indexes

After creating indexes, test these queries in Firebase Console:

```javascript
// Test Notes Query
const notesQuery = query(
  collection(db, 'notes'),
  where('createdBy', '==', 'test-user-id'),
  orderBy('updatedAt', 'desc')
);

// Test Flashcard Sets Query
const setsQuery = query(
  collection(db, 'flashcardSets'),
  where('createdBy', '==', 'test-user-id'),
  where('courseId', '==', 'test-course-id'),
  orderBy('updatedAt', 'desc')
);

// Test Courses Query
const coursesQuery = query(
  collection(db, 'courses'),
  where('category', '==', 'test-category'),
  orderBy('createdAt', 'desc')
);
```

---

**Total Indexes Required: 15 core indexes + 3 optional for future features**

This will ensure your Study Buddy mobile app performs optimally with Firebase Firestore! 🚀
