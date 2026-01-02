---
description: Timer Finish Button API Call Flow (Updated)
---

# Timer Finish Button - API Call Flow Documentation

This document explains the complete flow of API calls when a user finishes a study session and clicks "Save Progress & Close".

## Overview

When the user finishes a study session and clicks **"Save Progress & Close"**, the system saves both the completed topics AND the study time (with topic count) to the backend.

---

## Step-by-Step Flow

### **Step 1: User Clicks "Finish" Button**

**Location:** `frontend/components/FloatingTimer.tsx` (Finish button in floating timer, line 344)

The button click triggers the `handleStopSession()` function from the `TimerContext`.

---

### **Step 2: Timer Stops & Session Complete Modal Shows**

**File:** `frontend/context/TimerContext.tsx`
**Function:** `handleStopSession()` (Lines 93-96)

```typescript
const handleStopSession = async () => {
  setIsTimerRunning(false); // Stop the timer
  setIsSessionFinished(true); // Show session complete modal
  // Note: Study time is now saved when user clicks "Save Progress & Close"
};
```

**What happens:**

- Timer is stopped
- Session complete modal is displayed
- User can now select which topics they completed during the session
- **NO API call is made yet** - waiting for user to save progress

---

### **Step 3: User Selects Completed Topics & Clicks "Save Progress & Close"**

**Location:** `frontend/components/FloatingTimer.tsx`  
**Button:** "Save Progress & Close" (Lines 222-228)

The button triggers `handleSaveAndClose()` function which:

1. Updates completed topics in the backend
2. **Calls the study time update API with numberOfCompletedTopics**

---

### **Step 4: Save Completed Topics & Study Time**

**File:** `frontend/components/FloatingTimer.tsx`
**Function:** `handleSaveAndClose()` (Lines 34-78)

```typescript
const handleSaveAndClose = async () => {
  try {
    // 1. Update completed topics
    const updatedChapters = activeSubject.chapters.map(...);
    const subjectData = { ... };
    await subjectsAPI.updateCompletedTopics(subjectData);
    console.log("✅ Completed topics updated successfully!");

    // 2. Update study time with number of completed topics
    if (timerSeconds > 0) {
      const minutes = Math.ceil(timerSeconds / 60);
      const numberOfCompletedTopics = selectedSubtopics.length;

      await subjectsAPI.updateStudyTime(
        minutes,
        activeSubject.id || activeSubject._id,
        numberOfCompletedTopics  // NEW: Send completed topics count!
      );
      console.log(`✅ Study time: ${minutes}min, ${numberOfCompletedTopics} topics`);
    }
  } catch (error) {
    console.error("❌ Failed to update study session:", error);
  } finally {
    // Reset state and close modal
  }
};
```

**What happens:**

- Completed topics are saved first
- Then study time is updated with:
  - Minutes studied (rounded up)
  - Subject ID
  - **Number of completed topics** (new!)

---

### **Step 5: API Service Layer - Update Study Time**

**File:** `frontend/services/api.ts`
**Function:** `subjectsAPI.updateStudyTime()` (Lines 179-187)

```typescript
updateStudyTime: async (
  min: number,
  subjectId: string,
  numberOfCompletedTopics: number = 0
) => {
  const response = await axiosInstance.post("/subjects/studyTimeUpdate", {
    min,
    subjectId,
    numberOfCompletedTopics, // NEW parameter!
  });
  return response.data;
};
```

**API Details:**

- **Endpoint:** `POST /subjects/studyTimeUpdate`
- **Request Body:**
  ```json
  {
    "min": 45, // Study duration in minutes
    "subjectId": "507f1f77bcf86cd799439011", // MongoDB ObjectId
    "numberOfCompletedTopics": 3 // NEW: Count of topics completed
  }
  ```

---

### **Step 6: Backend Receives the Request**

**File:** `backend/src/subjects/subjects.controller.ts`
**Endpoint:** `POST /subjects/studyTimeUpdate` (Lines 60-68)

```typescript
@Post('studyTimeUpdate')
async updateStudyTime(
  @Body()
  studyTime: {
    min: number;
    subjectId: mongoose.Schema.Types.ObjectId,
    numberOfCompletedTopics: number  // Accepts the new parameter
  },
  @Req() req: any,
) {
  const userId = req.user.id;
  return this.subjectsService.updateStudyTime(userId, studyTime);
}
```

---

### **Step 7: Backend Saves Study Time to Database**

**File:** `backend/src/subjects/subjects.service.ts`
**Function:** `updateStudyTime()` (Lines 110-146)

```typescript
async updateStudyTime(
  userId: mongoose.Types.ObjectId,
  studyTime: {
    min: number;
    subjectId: mongoose.Schema.Types.ObjectId;
    numberOfCompletedTopics: number;  // NEW parameter
  },
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMillis = today.getTime();

  await this.studyTimeModel.findOneAndUpdate(
    {
      subjectId: studyTime.subjectId,
      studyDate: todayMillis,
    },
    {
      $inc: {
        studyMinutes: studyTime.min,
        numberOfCompletedTopics: studyTime.numberOfCompletedTopics || 0,  // INCREMENTS!
      },
      $setOnInsert: {
        userId,
        subjectId: studyTime.subjectId,
        studyDate: todayMillis,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );

  return {
    message: 'time is updated',
  };
}
```

**Key Points:**

- Uses `$inc` to **increment** both `studyMinutes` and `numberOfCompletedTopics`
- `upsert: true` creates a new document if none exists for today
- Multiple sessions per day will accumulate both minutes and topics

---

### **Step 8: Response Handling**

**Success Response:**

```json
{
  "message": "time is updated"
}
```

**Error Response:**

```json
{
  "statusCode": 400/500,
  "message": "Error message",
  "error": "Error details"
}
```

---

## Database Schema

### StudyTime Entity

**File:** `backend/src/subjects/entities/studtyTime.entity.ts`

```typescript
export class StudyTime {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  subjectId: string;

  @Prop({ required: true })
  studyMinutes: number;

  @Prop({ required: true })
  studyDate: number; // Timestamp (start of day in milliseconds)

  @Prop({ required: true })
  numberOfCompletedTopics: number; // NEW FIELD!
}
```

---

## Complete Call Stack

```
User Action (Click "Finish")
    ↓
handleStopSession() [TimerContext.tsx]
    ↓
Timer stops, Session Complete Modal shows
    ↓
User selects completed topics
    ↓
User clicks "Save Progress & Close"
    ↓
handleSaveAndClose() [FloatingTimer.tsx]
    ↓
subjectsAPI.updateCompletedTopics() → Updates subject chapters
    ↓
subjectsAPI.updateStudyTime(minutes, subjectId, numberOfCompletedTopics) [api.ts]
    ↓
axiosInstance.post("/subjects/studyTimeUpdate", { min, subjectId, numberOfCompletedTopics })
    ↓
HTTP POST Request → Backend Server
    ↓
[Backend] POST /subjects/studyTimeUpdate [subjects.controller.ts]
    ↓
[Backend] SubjectsService.updateStudyTime() [subjects.service.ts]
    ↓
[Backend] MongoDB: $inc studyMinutes and numberOfCompletedTopics
    ↓
[Backend] Return Success Response
    ↓
[Frontend] Response received
    ↓
[Frontend] Console log confirmation OR error handling
    ↓
[Frontend] Modal closed, state reset
```

---

## Data Flow Example

**Example Scenario:**

- User studied "Mathematics" for 45 minutes and 30 seconds
- User selected 3 completed topics (Trigonometry, Algebra, Calculus)
- Subject ID: `507f1f77bcf86cd799439011`
- Date: 2026-01-02

**1. Frontend Calculation:**

```javascript
timerSeconds = 2730  // 45 min 30 sec
minutes = Math.ceil(2730 / 60) = 46  // Rounded up to 46 minutes
numberOfCompletedTopics = selectedSubtopics.length = 3
```

**2. API Request:**

```http
POST /subjects/studyTimeUpdate
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "min": 46,
  "subjectId": "507f1f77bcf86cd799439011",
  "numberOfCompletedTopics": 3  ← NEW!
}
```

**3. Database Operation:**
If document exists for today:

```javascript
// INCREMENTS existing values
{
  studyMinutes: 120 → 166,  // +46
  numberOfCompletedTopics: 5 → 8  // +3
}
```

If no document exists for today:

```javascript
// Creates new document
{
  "_id": "...",
  "userId": "user123",
  "subjectId": "507f1f77bcf86cd799439011",
  "studyMinutes": 46,
  "studyDate": 1735804800000,
  "numberOfCompletedTopics": 3
}
```

---

## Key Changes from Previous Version

### ✅ What's New:

1. **`numberOfCompletedTopics` parameter** added to API call
2. API is now called on **"Save Progress & Close"** button (not "Finish" button)
3. Backend **increments** `numberOfCompletedTopics` (not just sets on insert)
4. Study time is saved **after** user selects completed topics
5. More accurate tracking - only saves when user confirms progress

### 🔄 What Changed:

- **Before:** Study time saved immediately when timer stops (no completed topics data)
- **After:** Study time saved when user clicks "Save Progress & Close" (with completed topics count)

### 📊 Benefits:

- Better data quality - users explicitly confirm what they completed
- Tracks correlation between study time and topics completed
- Allows users to skip saving if they didn't complete anything meaningful
- Multiple study sessions per day accumulate correctly

---

## Related Files

**Frontend:**

- `frontend/components/FloatingTimer.tsx` - Save button and handleSaveAndClose
- `frontend/context/TimerContext.tsx` - Timer logic and handleStopSession
- `frontend/services/api.ts` - API service layer with updated updateStudyTime
- `frontend/utils/axios.ts` - Axios instance with authentication

**Backend:**

- `backend/src/subjects/subjects.controller.ts` - Route handler
- `backend/src/subjects/subjects.service.ts` - Business logic with $inc operation
- `backend/src/subjects/entities/studtyTime.entity.ts` - Database schema
- `backend/src/subjects/subjects.module.ts` - Module configuration (StudyTime model registration)
- `backend/src/analytics/analytics.module.ts` - Also uses StudyTime model
