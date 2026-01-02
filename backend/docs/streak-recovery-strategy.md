# Strategy: Robust Streak Tracking & Recovery

## Objective

To decouple study streak updates from scheduled cron jobs, ensuring users' streaks are accurately calculated even after server downtime or missed scheduled tasks.

## Problem Analysis

Currently, streaks rely on a scheduled task (cron job) to run at a specific time (e.g., midnight). If the server is down during this window:

1. The job fails to run.
2. Streaks are not updated or reset.
3. Users lose their streak progress unfairly.

## Proposed Solution: Lazy Evaluation (On-Demand Calculation)

Instead of relying solely on a "push" model (server wakes up and updates everyone), we implement a "pull" model (update the streak when the user interacts with the system).

### 1. Database Schema Updates

We need to track _when_ the streak was last validated.
**Entity**: `User`

- **Add Field**: `lastStreakUpdateDate` (Type: Date or Timestamp) representing the last date (at midnight) for which we successfully calculated the streak.

### 2. The "Catch-Up" Algorithm

Whenever a user performs a relevant action (e.g., logging in, viewing the dashboard, or updating study time), we trigger a calculation to bridge the gap between their `lastStreakUpdateDate` and `Today`.

#### Trigger Points

- `GET /subjects/streak` (Dashboard Load)
- `POST /subjects/study-time` (Session Complete)

#### Logic Flow

1. **Fetch User State**: Get current `streak` and `lastStreakUpdateDate`.
2. **Determine Range**: Identify the date range from `lastStreakUpdateDate + 1 day` up to `Yesterday`.
3. **Iterate & Validate**:
   - For each day in the range:
     - Query the `StudyTime` collection for the user's total minutes on that specific date.
     - Compare with their `studyMinutes` (Study Goal).
     - **If Goal Met**: Increment `streak`.
     - **If Goal Missed**: Reset `streak` to 0. (Note: If they missed a day 3 days ago, the streak resets there, but if they met the goal yesterday, it might restart to 1, depending on business logic. Usually, a break anywhere resets the whole chain up to that point).
4. **Update State**:
   - Save the new `streak` value.
   - Update `lastStreakUpdateDate` to `Yesterday` (or today, if we are including today's real-time check).

### 3. Handling "Today"

- If the user completes their goal _right now_ (Today):
  - The system checks if `StudyTime (Today) >= Goal`.
  - If yes, and the streak hasn't already been incremented for today (check `lastStreakUpdateDate`), increment `streak` and set `lastStreakUpdateDate` to `Today`.

### 4. Edge Cases

- **Timezones**: Ensure all "midnight" calculations use a consistent timezone (preferably stored on the user profile or defaulting to UTC/Server time) to avoid "shifting days".
- **Changing Goals**: If a user changes their goal today, should it apply to yesterday's check? _Recommendation_: Use the current goal for simplicity unless historical goal tracking is implemented.

## Implementation Plan

1. **Modify User Entity**: Add `lastStreakUpdateDate`.
2. **Update Service**: Refactor `getStreak` in `SubjectsService` to include the Catch-Up Algorithm.
3. **Remove Cron Job**: Deprecate the unreliable midnight cron job.

## Pseudo-Code Example

```typescript
async getStreak(userId) {
  const user = await userModel.findById(userId);
  const today = startOfDay(new Date());

  // Loop from last checked date up to today
  let checkDate = addDays(user.lastStreakUpdateDate, 1);

  while (checkDate < today) {
    const minutesStudied = await getStudyMinutesForDate(userId, checkDate);
    if (minutesStudied >= user.studyMinutes) {
      user.streak += 1;
    } else {
      user.streak = 0;
    }
    user.lastStreakUpdateDate = checkDate;
    checkDate = addDays(checkDate, 1);
  }

  await user.save();
  return user.streak;
}
```
