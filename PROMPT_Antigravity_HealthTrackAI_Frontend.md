# PROMPT — HealthTrack AI Frontend (React Native)
# To be given to Antigravity / Claude Code / any AI coding agent
# =====================================================================

---

## CONTEXT & PROJECT

You are building the **React Native frontend** of **HealthTrack AI**, an intelligent wellness
monitoring mobile application designed for the Moroccan market. The app targets three types of
users: **Patients**, **Doctors**, and **Admins**.

This is a Sprint 2 delivery. You will implement:
1. The **Authentication screens** (Login, Register, Forgot Password)
2. The **Patient Workspace** (Dashboard + core navigation)
3. The **Doctor Workspace** (Patient list, Patient file, AI review, Notes, Prescriptions)
4. The **Admin Workspace** (Stats dashboard, User management, AI module config)

No backend calls needed yet — use **mock data** everywhere. Focus entirely on UI quality,
navigation structure, and design system consistency.

---

## DESIGN IDENTITY — NON-NEGOTIABLE

The visual identity is derived from the app logo: a **Khamsa (Hand of Fatima)** with arabesque
patterns, a Moroccan star, and a heartbeat line inside, enclosed in a circular frame.

### Color Palette (extract from the logo)

```
Primary Green (dominant):  #0A6B4B   (deep emerald — the main brand color)
Light Green (ring):        #1A9B6C   (medium emerald — hover states, accents)
Background tint:           #E8F5F0   (very light mint — card backgrounds in light mode)
Gold accent:               #C9A84C   (warm gold — highlights, CTAs, important badges)
Gold light:                #EDD47A   (light gold — subtle highlights)
White:                     #FFFFFF   (surfaces, text on dark)
Dark text:                 #0D2318   (near-black with green tint — primary text)
Muted text:                #4A7A66   (muted green — secondary text, placeholders)
Danger:                    #C0392B   (alerts, critical risk)
Warning:                   #E67E22   (moderate risk)
Success:                   #27AE60   (low risk, positive states)
Surface dark:              #0D2318   (dark mode background — deep forest green)
Card dark:                 #122B1E   (dark mode card surface)
```

### Design Direction

**Refined Moroccan Luxury** — think a high-end wellness app that feels rooted in Moroccan
heritage without being folkloric. Clean, modern, and premium. The aesthetic should feel like
what Apple Health would look like if it were designed in Casablanca.

Key aesthetic rules:
- **Backgrounds**: Use the deep emerald `#0D2318` for the main app background (dark mode
  is the primary mode). Cards use `#122B1E` with a subtle `1px` border in `#1A9B6C22`.
- **Typography**: Use `Playfair Display` for headings (serif, elegant) and `Inter` for body text.
  Import both via expo-google-fonts. Headings feel editorial; body feels clean and clinical.
- **Gold as a power color**: Use `#C9A84C` for primary action buttons, active tab indicators,
  risk badges for HIGH/CRITICAL alerts, and section titles on dark backgrounds.
- **Cards**: Rounded corners `border-radius: 16px`. Subtle shadow. Never flat boxes.
- **Arabesque micro-detail**: One thin arabesque SVG pattern as a watermark/texture on the
  auth screen background — very subtle opacity (5-8%), not distracting.
- **Animations**: Smooth fade-in on screen mount (150ms). Card press scales down to 0.97.
  Tab bar icons have a small bounce on select.
- **No generic UI**: No default React Native blue. No gray placeholder headers. No default
  Switch components — use custom styled ones.

---

## TECH STACK

```
Framework:        React Native with Expo (SDK 51)
Navigation:       React Navigation v6 (Stack + Bottom Tabs + Drawer)
State:            Redux Toolkit + redux-persist
Styling:          StyleSheet API (no external styling lib) + custom theme system
Icons:            @expo/vector-icons (Ionicons + MaterialCommunityIcons)
Charts:           Victory Native (for health trend charts)
Fonts:            expo-google-fonts (Playfair_Display, Inter)
Animations:       React Native Animated API + Reanimated 2
Storage:          expo-secure-store (tokens), expo-sqlite (offline records)
```

---

## FILE STRUCTURE TO FOLLOW

All screens go in `mobile/src/screens/`, components in `mobile/src/components/`.
The theme system lives in `mobile/src/theme/`. Navigation in `mobile/src/navigation/`.

---

## SCREENS TO BUILD — DETAILED SPECS

---

### SCREEN GROUP 1 — AUTHENTICATION

#### 1.1 SplashScreen
- Full screen, dark green background `#0D2318`
- App logo centered (PNG import from `assets/images/logo_app.png`)
- App name "HealthTrack" in Playfair Display, gold, 32px below the logo
- Tagline "Your health. Your data. Your control." in Inter, muted green, 14px
- Auto-navigates to Login after 2 seconds with a fade transition
- Subtle arabesque SVG watermark in the background at 6% opacity

#### 1.2 LoginScreen
- Background: `#0D2318` with arabesque watermark pattern
- Top third: small logo + "HealthTrack" wordmark centered
- Card container: `#122B1E`, rounded 20px, padding 28px, takes 65% of screen height
- Inside the card:
  - Title: "Welcome back" in Playfair Display, white, 26px
  - Subtitle: "Sign in to continue" in Inter, muted, 14px
  - Email input: custom styled, dark border, white text, green focus glow
  - Password input: same, with show/hide toggle (eye icon in gold)
  - "Forgot password?" link aligned right, gold, 13px
  - Primary button: "Sign In" — gold background `#C9A84C`, dark text, full width, 52px height, rounded 14px
  - Divider: thin line with "or" in center
  - Social hint text: "New to HealthTrack?" + "Create account" link in gold
- Bottom safe area: language selector (EN | FR | AR) — small text, centered, muted

#### 1.3 RegisterScreen
- Same dark background and card style as Login
- Multi-step form (2 steps):
  - Step 1: First name, Last name, Email, Password, Confirm password
  - Step 2: Role selector (Patient / Doctor), Date of birth, Language preference
- Step indicator: two dots at the top of the card, active = gold, inactive = dark green
- "Next" button goes to step 2, "Create Account" submits on step 2
- Back arrow on step 2 returns to step 1
- Role selector: two large tappable cards with icons (person icon for Patient, stethoscope for Doctor)
  — selected card gets gold border and gold icon

#### 1.4 ForgotPasswordScreen
- Simple centered layout
- Back arrow top left
- Title "Reset Password", subtitle "Enter your email address"
- Single email input
- "Send Reset Link" gold button
- Success state: green checkmark animation + "Check your inbox" message

---

### SCREEN GROUP 2 — PATIENT WORKSPACE

Navigation: Bottom tab bar with 5 tabs:
`Dashboard | Records | Symptoms | Locator | Profile`

Tab bar style:
- Background: `#0D2318` with top border `#1A9B6C33`
- Active tab: gold icon + gold label, small animated dot below
- Inactive tab: muted green icon, no label

#### 2.1 DashboardScreen (Patient)

Header:
- "Good morning, [Name]" — Playfair Display, white, 22px
- Date subtitle — Inter, muted, 13px
- Bell icon (notifications) top right — gold if unread badge present

Quick Stats Row (horizontal scroll):
- 4 metric cards: Heart Rate, Steps, Sleep, Risk Score
- Each card: `#122B1E` background, gold metric value (large), label below, small trend arrow
- Risk Score card uses semantic color (green/amber/red) for the value

Section "Today's Recommendations":
- Horizontal scrollable cards
- Each card: recommendation icon (emoji or icon), short text, category tag
- Card background: subtle gradient from `#122B1E` to `#1A2E22`

Section "Recent Records":
- List of last 3 health records
- Each row: icon + type + date + value + small badge (source: MANUAL / SENSOR / EHR)

Section "AI Status":
- If pending analysis: pulsing gold dot + "Analysis in progress..."
- If result ready: green dot + "View latest analysis" tappable row with arrow

Bottom floating card (if doctor has left a note):
- "Your doctor left a note" — gold border card, tappable

#### 2.2 ManualEntryScreen

- Scrollable form with grouped sections:
  - "Vitals": Heart Rate (bpm), Blood Pressure (sys/dia), Blood Glucose (mg/dL)
  - "Activity": Steps, Active Minutes, Calories
  - "Sleep": Bedtime, Wake time, Quality rating (1-5 stars, gold stars)
  - "Body": Weight (kg), Height (cm — only first time)
- Each input group has a section header in gold, small uppercase Inter 11px
- Number inputs with unit label inside the field (right aligned)
- "Save Record" button: full width, gold, 52px, fixed at bottom
- Haptic feedback on save

#### 2.3 EHRImportScreen

- Three import options as large tappable cards:
  - "Import PDF" — document icon
  - "Import FHIR / HL7" — code/api icon
  - "Scan Document" — camera icon
- Below: list of previously imported documents
  - Each item: file icon + filename + date + parse status badge (PENDING / DONE / FAILED)
- Status badge colors: PENDING=amber, DONE=green, FAILED=red

#### 2.4 HealthHistoryScreen

- Filter bar at top: All | Vitals | Activity | Sleep | EHR
- List of health records grouped by date
- Each record row: icon + type + value + source badge + time
- Tapping a record expands it inline to show full details

#### 2.5 SymptomInputScreen

- Three input modes as tab selector at top:
  - Text (keyboard icon), Voice (mic icon), Image (camera icon)
- Text mode: large multiline input, placeholder "Describe how you feel..."
- Voice mode: large mic button (gold, pulsing when recording), waveform animation during recording
- Image mode: camera capture or gallery picker, image preview thumbnail
- "Get AI Evaluation" gold button at bottom
- If result loaded: show AIEvaluationCard inline
  - Risk badge (color-coded), summary text, 3 recommendations, "Share with Doctor" button

#### 2.6 HealthServiceLocatorScreen

- Map view (react-native-maps or placeholder) taking 55% of screen
- Bottom sheet: search bar + list of nearby results
- Each result: name + type (clinic/pharmacy/center) + distance + open/closed badge
- Tapping result shows detail sheet: address, hours, phone, "Get Directions" button

---

### SCREEN GROUP 3 — DOCTOR WORKSPACE

Navigation: Bottom tab bar with 4 tabs:
`Patients | Alerts | Profile | Settings`

#### 3.1 DoctorHomeScreen

Header:
- "Dr. [Last Name]" — Playfair Display, white, 22px
- Specialty subtitle — muted, Inter, 13px

Alert Queue section:
- Horizontal scroll of "Urgent" patient cards
- Each card: patient name + age + risk level badge + alert type + time
- CRITICAL cards have a subtle red glow border

Patient List section:
- Search bar at top
- List of assigned patients
- Each row: avatar (initials in circle, gold bg) + name + last seen + current risk dot
- Tapping row navigates to PatientFileScreen

#### 3.2 PatientFileScreen

Header:
- Patient name + age + blood type tag
- Back arrow, top right: "Export PDF" icon (gold)

Tabs inside the screen:
- Overview | Records | AI Analysis | Notes | Prescriptions

**Overview tab**:
- Patient info card: DOB, blood type, insurance coverage
- Current risk score: large colored number with label
- Last state snapshot: trend indicator (improving/stable/degrading) with color arrow

**Records tab**:
- Scrollable timeline of health records (same style as HealthHistoryScreen)
- Filter chips at top: All | Vitals | Activity | Sleep | EHR

**AI Analysis tab**:
- List of past AI analysis results
- Each item: date + type + risk level + confidence % + validation status
- Validation status: PENDING REVIEW (gold), CONFIRMED (green), CORRECTED (blue), REJECTED (red)
- Tapping opens AIReviewScreen

**Notes tab**:
- List of clinical notes (doctor's own + from other doctors)
- Each note: avatar + name + date + note text (truncated, expand on tap)
- FAB button: "+" to add new note
- Note editor: full screen modal with multiline input + "Save Note" gold button

**Prescriptions tab**:
- List of prescriptions
- Each: date + medications list (truncated) + validity badge (ACTIVE/EXPIRED)
- FAB button: "+" to create new prescription
- Prescription editor: medication name + dosage + frequency + duration fields + "Issue Prescription" button

#### 3.3 AIReviewScreen

- Shows full AI analysis result:
  - Risk level badge (large, color-coded)
  - Confidence score: circular progress ring in gold
  - Analysis type label
  - Summary text paragraph
  - Detected anomalies list (each with icon)
  - Recommendations from AI (list)

- Doctor action section (bottom):
  - Three action buttons in a row:
    - "Confirm" — green filled button
    - "Correct" — amber outlined button
    - "Reject" — red outlined button
  - Selecting "Correct" reveals:
    - Corrected diagnosis text input
    - Clinical notes text input
  - "Submit Review" gold button at bottom

---

### SCREEN GROUP 4 — ADMIN WORKSPACE

Navigation: Bottom tab bar with 4 tabs:
`Dashboard | Users | AI Modules | Settings`

#### 4.1 AdminDashboardScreen

Header: "Admin Panel" in Playfair Display

Stats grid (2x2):
- Total Users, Active Patients, Registered Doctors, AI Analyses Today
- Each stat: large number in gold, label in muted, icon top right

Charts section:
- "User Growth" — line chart (Victory Native) last 7 days, gold line on dark bg
- "AI Analysis by Type" — horizontal bar chart, different shades of green/gold

Recent Activity feed:
- List of recent platform events (new user, analysis completed, alert dispatched)
- Each: icon + message + timestamp

#### 4.2 UserManagementScreen

- Search bar + filter chips: All | Patients | Doctors | Admins
- List of users: avatar + name + role badge + status (ACTIVE/SUSPENDED) + join date
- Long press or swipe reveals: Suspend / Delete / View actions
- FAB: "+" to invite new doctor (email invite form)

#### 4.3 AIModuleConfigScreen

- List of AI modules:
  - Anomaly Detection
  - Risk Scoring
  - Computer Vision (CV)
  - Symptom NLP
  - EHR Extraction
- Each module row:
  - Module name + description
  - Active/Inactive toggle (custom styled, green when active)
  - Confidence threshold slider (shows current % value, gold slider thumb)
  - "Configure" button opens detail sheet
- Detail bottom sheet:
  - Module name + version
  - Threshold fields per metric
  - "Save Configuration" gold button

---

## NAVIGATION STRUCTURE

```
AppNavigator (Stack)
  ├── SplashScreen
  ├── AuthNavigator (Stack)
  │   ├── LoginScreen
  │   ├── RegisterScreen
  │   └── ForgotPasswordScreen
  └── MainNavigator (based on user role from Redux state)
      ├── PatientNavigator (Bottom Tabs)
      │   ├── DashboardScreen
      │   ├── RecordsNavigator (Stack)
      │   │   ├── HealthHistoryScreen
      │   │   ├── ManualEntryScreen
      │   │   └── EHRImportScreen
      │   ├── SymptomNavigator (Stack)
      │   │   ├── SymptomInputScreen
      │   │   └── AIEvaluationScreen
      │   ├── HealthServiceLocatorScreen
      │   └── ProfileScreen
      ├── DoctorNavigator (Bottom Tabs)
      │   ├── DoctorHomeScreen
      │   ├── AlertQueueScreen
      │   ├── PatientNavigator (Stack)
      │   │   ├── PatientFileScreen (with inner tabs)
      │   │   └── AIReviewScreen
      │   └── DoctorProfileScreen
      └── AdminNavigator (Bottom Tabs)
          ├── AdminDashboardScreen
          ├── UserManagementScreen
          ├── AIModuleConfigScreen
          └── AdminSettingsScreen
```

---

## MOCK DATA

Create a file `mobile/src/utils/mockData.ts` with:

```typescript
// Mock logged-in patient
export const mockPatient = {
  id: "p-001",
  firstName: "Youssef",
  lastName: "Bennani",
  role: "PATIENT",
  riskLevel: "MODERATE",
  heartRate: 78,
  steps: 6420,
  sleepHours: 6.5,
  sleepQuality: 3,
};

// Mock logged-in doctor
export const mockDoctor = {
  id: "d-001",
  firstName: "Fatima",
  lastName: "El Alaoui",
  role: "DOCTOR",
  specialty: "General Practitioner",
};

// Mock patients list for doctor
export const mockPatients = [
  { id: "p-001", name: "Youssef Bennani", age: 34, riskLevel: "MODERATE", lastSeen: "2h ago" },
  { id: "p-002", name: "Khadija Ouali", age: 58, riskLevel: "HIGH", lastSeen: "1d ago" },
  { id: "p-003", name: "Omar Tazi", age: 45, riskLevel: "LOW", lastSeen: "3d ago" },
  { id: "p-004", name: "Amina Chraibi", age: 29, riskLevel: "LOW", lastSeen: "1w ago" },
];

// Mock health records
export const mockRecords = [
  { id: "r-001", type: "VITALS", heartRate: 78, bloodPressure: "120/80", timestamp: "2025-04-22T08:30:00", source: "MANUAL" },
  { id: "r-002", type: "ACTIVITY", steps: 6420, activeMinutes: 42, timestamp: "2025-04-22T07:00:00", source: "SENSOR" },
  { id: "r-003", type: "SLEEP", duration: 6.5, quality: 3, bedTime: "23:30", wakeTime: "06:00", timestamp: "2025-04-22T06:00:00", source: "MANUAL" },
];

// Mock AI analysis results
export const mockAIResults = [
  {
    id: "ai-001",
    type: "ANOMALY",
    riskLevel: "MODERATE",
    confidence: 0.82,
    summary: "Irregular heart rate pattern detected over the last 48 hours. Sleep quality has declined. Recommend increasing rest and reducing caffeine.",
    recommendations: [
      { category: "SLEEP", message: "Target 7-8 hours of sleep per night.", priority: "HIGH" },
      { category: "ACTIVITY", message: "Light walking 30 minutes per day.", priority: "MEDIUM" },
      { category: "HYDRATION", message: "Increase water intake to 2L daily.", priority: "LOW" },
    ],
    validationStatus: "PENDING",
    generatedAt: "2025-04-22T09:00:00",
  },
];

// Mock admin stats
export const mockAdminStats = {
  totalUsers: 1247,
  activePatients: 892,
  registeredDoctors: 134,
  analysesToday: 67,
  userGrowth: [12, 19, 28, 35, 41, 58, 67],
};
```

---

## THEME SYSTEM

Create `mobile/src/theme/colors.ts`:

```typescript
export const colors = {
  // Backgrounds
  bgPrimary:    "#0D2318",
  bgCard:       "#122B1E",
  bgCardBorder: "#1A9B6C22",

  // Brand
  green:        "#0A6B4B",
  greenLight:   "#1A9B6C",
  greenMint:    "#E8F5F0",

  // Gold
  gold:         "#C9A84C",
  goldLight:    "#EDD47A",

  // Text
  textPrimary:  "#FFFFFF",
  textMuted:    "#4A7A66",
  textDark:     "#0D2318",

  // Semantic
  success:      "#27AE60",
  warning:      "#E67E22",
  danger:       "#C0392B",
  info:         "#2980B9",

  // Risk levels
  riskLow:      "#27AE60",
  riskModerate: "#E67E22",
  riskHigh:     "#C0392B",
  riskCritical: "#8B0000",

  // Tab bar
  tabActive:    "#C9A84C",
  tabInactive:  "#4A7A66",
  tabBg:        "#0D2318",
};
```

Create `mobile/src/theme/typography.ts` — use `Playfair_Display` for display/heading text
and `Inter` for all body text.

---

## COMPONENT LIBRARY TO CREATE

These reusable components must be built first, then used in all screens:

1. `GreenCard` — dark card with rounded 16px, subtle border
2. `GoldButton` — primary CTA, gold background, dark text, 52px height
3. `OutlineButton` — transparent background, gold border and text
4. `HealthMetricCard` — compact stat card (icon + value + label + trend)
5. `RiskBadge` — color-coded pill for LOW / MODERATE / HIGH / CRITICAL
6. `CustomInput` — styled text input matching the dark theme
7. `SectionHeader` — gold uppercase label for section titles
8. `PatientRow` — list item for patient list (avatar + name + risk + time)
9. `RecordRow` — list item for health records (icon + type + value + source)
10. `AIResultCard` — shows AI result summary with risk badge and recommendations
11. `CustomTabBar` — fully custom tab bar replacing React Navigation default

---

## QUALITY REQUIREMENTS

- Every screen must be **complete and functional** with mock data — no TODO placeholders
- All navigation transitions must work correctly
- Keyboard avoiding behavior on all forms
- Safe area insets respected on all screens (expo-safe-area-context)
- The app must work on both Android and iOS (no platform-specific hacks)
- All text must be accessible (minimum contrast ratio 4.5:1)
- Loading states with skeleton loaders (not just spinners) for list screens
- Empty states with illustration and message for lists with no data
- Error states handled gracefully

---

## WHAT TO DELIVER

1. All screen files in `mobile/src/screens/`
2. All component files in `mobile/src/components/`
3. Complete navigation setup in `mobile/src/navigation/`
4. Theme system in `mobile/src/theme/`
5. Mock data in `mobile/src/utils/mockData.ts`
6. Updated `mobile/App.tsx` wiring everything together
7. Any required asset files noted (SVG arabesque pattern, etc.)

---

## SKILLS TO GIVE ANTIGRAVITY

If your tool (Antigravity / Claude Code / similar) supports **skill files**, give it
the following:

### Skill 1 — frontend-design
Paste the content below as a skill named `frontend-design`:

```
This skill guides creation of distinctive, production-grade frontend interfaces.

Design Thinking: Before coding, understand the context and commit to a BOLD aesthetic direction.
- Purpose: What problem does this interface solve?
- Tone: For HealthTrack AI, the direction is REFINED MOROCCAN LUXURY.
  Clean, modern, premium. Think Apple Health designed in Casablanca.
- Differentiation: Every screen should feel like it belongs to the same luxury health brand.

Rules:
- Typography: Playfair Display for headings, Inter for body. Never Arial, Roboto, or system fonts.
- Color: Dark green backgrounds (#0D2318), gold accents (#C9A84C), muted green text (#4A7A66).
- Motion: Smooth 150ms fade-in on mount. Cards scale to 0.97 on press. Tab bounce on select.
- Cards: Always rounded 16px, dark surface #122B1E, subtle 1px green border.
- Gold is a power color: use it for CTAs, active states, important badges — not decoration.
- Never use default React Native styles. Override everything.
- Every color, spacing, and font must come from the theme system.
```

### Skill 2 — react-native-patterns
Paste this as a skill named `react-native-patterns`:

```
React Native best practices for this project:

Navigation: React Navigation v6 with typed routes (NavigationProp from @react-navigation/native).
State: Redux Toolkit slices. Use useAppDispatch and useAppSelector typed hooks.
Styling: StyleSheet.create() only. No inline styles except for dynamic values.
Fonts: Load via useFonts() from expo-google-fonts at the root App.tsx level.
Safe area: Wrap every screen root in SafeAreaView from expo-safe-area-context.
Keyboard: Use KeyboardAvoidingView + ScrollView on all forms.
Lists: Use FlatList for all lists, never map() into a ScrollView.
Images: Use expo-image for optimized loading.
Animations: Prefer React Native Animated API for simple animations, Reanimated 2 for complex gestures.
Platform: Use Platform.select() for any platform difference, not Platform.OS === checks inline.
Performance: Memoize list item components with React.memo(). Use useCallback for handlers passed to FlatList.
```

---

## HOW TO GIVE SKILLS IN ANTIGRAVITY

In Antigravity (or any tool that supports skills/contexts):

1. Open the **Skills** or **Context** panel (usually a book icon or "+" in the sidebar)
2. Click **"New Skill"** or **"Add Context"**
3. Name it `frontend-design` and paste the skill content above
4. Create a second skill named `react-native-patterns` with the second block
5. Before starting the task, make sure both skills are **activated/selected**
6. Then paste this entire prompt in the chat

In **Claude Code** (terminal):
```bash
# Create a CLAUDE.md file in the project root with the skill content
# Claude Code reads CLAUDE.md automatically at every session
cat > CLAUDE.md << 'EOF'
[paste skill content here]
EOF
```

In **Cursor**:
- Use `.cursorrules` file in the project root
- Paste both skill blocks into that file

---

## FINAL NOTE TO THE AGENT

The app logo (`assets/images/logo_app.png`) is a Khamsa with arabesque motifs,
a Moroccan star, and a heartbeat line. The color story of the entire app must
honor this logo. Every screen, when a user sees it, should feel like it belongs
to the same universe as that logo.

Do not use generic health app UI patterns (green circles, white cards on white backgrounds,
pastel blues). This is a premium product. Make it feel premium.
```
