## Daily Domain (Developer Overview)

The Daily domain manages short–lived, per-day exercise tracking for members. It provides:

- Definition & maintenance of reusable daily exercises ("catalog" of exercises)
- Automatic initialization of per-member exercise progress entries for a selected date
- Real‑time (current-day) editing of progress percentages toward an exercise's target
- Normalized persistence in Firestore with lightweight client state held in Angular signals

> Scope: This does NOT (yet) implement long‑running multi-day challenge logic; it is focused on a single calendar day snapshot of member progress against that day's exercise set. The wording “challenges” in earlier drafts actually refers to “daily exercises + member progress”.

---

### Core Concepts

| Concept      | Description                                                                               |
| ------------ | ----------------------------------------------------------------------------------------- |
| Exercise     | A template describing what should be done today (name, numeric target, unit).             |
| Progress     | A member's % completion (0–100) toward a single exercise for a specific calendar day.     |
| Date Context | The selected working day (defaults to today); drives which progress documents are loaded. |

---

### Firestore Persistence Model

Collections:

- `daily_exercises` — Documents keyed by `exercise.id`.
- `daily_exercise-progresses` — Documents keyed by composite deterministic ID (see below).

Converters (in `infrastructure/firebase-converter/`):

- `ExerciseConverter` normalizes unit & casts numeric fields.
- `ExerciseProgressConverter` converts Firestore timestamps to `Date` for client consumption.

#### ID Strategy

`Progress.id = BuildExerciseProgressId(exerciseId, memberId, date)`
Implementation:

```
`${exerciseId}-${memberId}-${date.toDateString()}` // Date string is locale-sensitive JS toDateString()
```

Implications:

- Using `toDateString()` ties identity to local timezone representation. If timezone handling becomes important, migrate to an ISO UTC format (e.g. `YYYY-MM-DD`) to avoid collisions / drift.
- Deterministic IDs allow idempotent creation (safe re-run of initialization without producing duplicates) but only if the exact same date (same TZ) object is used.

---

### State Management (Angular Signals)

The `ExersiceService` (note: spelling contains a minor typo) centralizes state:

- `_date: signal<Date>` — currently selected day. Changing it triggers reload of progresses for that day.
- `_exercises: signal<Exercise[]>` — in-memory catalog of all exercises (loaded once on service construction).
- `_progresses: signal<Progress[]>` — all progress documents for the selected day.
- `_loadedProgresses: signal<boolean>` — guards UI rendering / disable states until async load completes.

Public computed selectors:

- `date` returns a defensive clone of `_date()`
- `progressEditEnabled` true only when selected date is today (prevents backdated edits)
- `exercises` cloned exercise list
- `todaysExerciseProgresses` filtered by calendar components (year, month, day) vs selected date

Mutation Entry Points:

- `setDate(date)` — reloads progress snapshot (exercises remain cached)
- `initExerciseProgresses(memberIds)` — creates missing progress rows for each member × exercise for the selected date (all initialized to 0%)
- `setExerciseProgress(exerciseId, memberId, progress)` — persists and patches local state
- `addExercise(dto)` / `editExercise(entity)` / `removeExercise(id)` — CRUD for exercise catalog (and cascade delete of related progresses on removal)

Threading / Concurrency Considerations:

- There is no optimistic locking; last write wins.
- Race condition possible if two clients call `initExerciseProgresses` simultaneously (duplicate set attempts). Firestore `setDoc` with deterministic ID resolves to overwrite (safe), but higher-level detection of “already exists” is not surfaced; progress remains at whichever state was last written (likely 0). Future enhancement: `getDoc` + conditional create, or migrate to batched writes with existence checks.

---

### Data Loading Lifecycle

1. Service constructs -> triggers `getExercises()` and `getExerciseProgresses(today)`.
2. UI subscribes to signals; when `_loadedProgresses` becomes true, displays daily grid tables.
3. User can pick a different date -> `setDate` resets `_loadedProgresses=false`, fires new query (between start-of-day 00:00:00 and end-of-day 23:59:59 local time) using two `where` filters on `date` field.
4. Only current-day (`progressEditEnabled === true`) allows editing progress; historical days are effectively read-only.

Query Pattern for Progresses:

```
where('date', '>=', Timestamp.fromDate(startOfDay))
where('date', '<=', Timestamp.fromDate(endOfDay))
```

This yields all progresses for _any_ member for that day.

---

### UI Layer Overview

Primary feature component presented in code snippet: `Exercises` component

Responsibilities:

- List existing exercises in a Material table.
- Provide expansion panel form for add/edit operations.
- Toggle between add vs edit mode based on `selectedExerciseId` signal.
- Deletion with inline action button; prevents row click propagation.

Not Shown (expected future pieces):

- A progress grid (likely `progresses` feature folder) to display each member × exercise progress (there are progress-related components in the folder structure: e.g., `progress-dialog.component.*`).
- Toolbar components for date selection & initialization of daily progresses.

---

### Error Handling / Validation Gaps

- Service methods assume Firestore operations succeed (no try/catch). Add user feedback mechanisms (snack bars, retry) as future improvement.
- No guard against setting `progress` outside 0–100; rely on callers. Consider clamping or throwing inside `setExerciseProgress`.
- Exercise `target` can be set to 0 (allowed but maybe meaningless). Potential validation rule: enforce target > 0.

---

### Extensibility Guidelines

If you add features, keep these patterns:

1. Use deterministic IDs for any (entityA, entityB, date) composite join records.
2. Expose only cloned snapshots via computed signals to prevent accidental external mutation.
3. Keep Firestore converters trivial and pure; centralize normalization there (type coercion, defaulting).
4. Avoid leaking Firestore SDK types (e.g., `Timestamp`) beyond the service layer when possible; convert eagerly to `Date` for UI ergonomics.
5. Consider splitting writes into a repository layer only if domain logic (e.g. challenge rules, awarding points) grows beyond simple CRUD.

Potential Next Steps:

- Add challenge abstraction layering on top of exercises (grouped sets, progress aggregation)
- Introduce server-side security rules & validation (prevent editing past dates)
- Add offline caching (e.g., via Firestore persistence or localStorage) for exercises
- Replace `toDateString()` in ID with stable `YYYY-MM-DD` to make timezone shifts explicit
- Implement batch writes for `initExerciseProgresses` to improve performance & atomicity

---

### Quick Reference (Cheat Sheet)

- Initialize day for members: `initExerciseProgresses([memberIds...])`
- Update progress: `setExerciseProgress(exerciseId, memberId, pct)` (0–100)
- Add new exercise: `addExercise({ name, target, unit })`
- Change selected date: `setDate(date)` (resets progress list & editability)

---

### Glossary

Repeatitions: Typo-preserved domain term (should be 'repetitions'); stored as-is to keep backwards compatibility with existing data & logic.

---

### Known Typos / Technical Debt

- `ExersiceService` class name typographical error (rename requires updating all imports)
- `'repeatitions'` in type union & persisted data
  - If you normalize later, create a migration strategy + maintain converter to map old -> new.

---

### Summary

The Daily domain is a focused slice handling per-day exercise definitions and per-member progress tracking with deterministic IDs and Angular signal-based local state. It is intentionally simple now but structured for layering more complex daily challenge / aggregation logic in future iterations.
