Berikut design system lengkap yang siap diimplementasikan di Figma, berdasarkan tema yang sudah dibangun:

1. Color Palette
Primary & Brand
Token Name	Hex	Penggunaan
cyan-400	#00D4FF	CTA utama, active nav, border highlight
cyan-300	#38E8FF	Hover state, glow effect
cyan-dim	#00D4FF26	Background badge, chip fill
emerald-400	#10B981	Success state, progress bar, XP gain
emerald-dim	#10B98126	Success modal bg, tag fill
Backgrounds (Dark Mode Stack)
Token Name	Hex	Penggunaan
bg-base	#07090F	Page background
bg-panel	#0D1525	Card, sidebar, modal
bg-elevated	#111827	Hover card, dropdown, tooltip
bg-overlay	#1A2535	Input field, code block
Semantic Colors
Token Name	Hex	Penggunaan
amber-400	#F59E0B	Warning, daily challenge, streak
red-500	#EF4444	Error state, wrong pin
purple-500	#A855F7	Subnet mask highlight, kelas D
slate-400	#94A3B8	Body text secondary
slate-600	#4A5568	Label, placeholder, muted text
Border & Surface
Token Name	Hex / Value	Penggunaan
border-cyan	#00D4FF1F (12% opacity)	Card border default
border-cyan-hover	#00D4FF4D (30% opacity)	Card border hover
border-subtle	#FFFFFF0A (4% opacity)	Divider, rule
2. Typography Hierarchy
Font Families
Display  → Exo 2        (headings, labels, badges, nav)
Body     → Inter        (body copy, descriptions, paragraphs)
Mono     → JetBrains Mono  (IP addresses, XP values, pin labels, binary)
Scale
Role	Font	Weight	Size	Line Height	Letter Spacing	Contoh
display-xl	Exo 2	800	36px	1.1	−0.5px	Hero heading
display-lg	Exo 2	700	28px	1.2	−0.3px	Page title
display-md	Exo 2	700	20px	1.3	−0.2px	Section heading
display-sm	Exo 2	700	16px	1.4	0px	Card title
display-xs	Exo 2	600	13px	1.4	0px	Nav item, badge label
body-md	Inter	400	14px	1.6	0px	Description, paragraph
body-sm	Inter	400	12px	1.5	0px	Caption, hint text
mono-md	JetBrains Mono	500	13px	1.4	0px	IP address, XP number
mono-sm	JetBrains Mono	400	11px	1.3	0.3px	Pin label, status tag
mono-xs	JetBrains Mono	400	10px	1.2	0.5px	Binary bit, timestamp
3. Auto-Layout Struktur Per Komponen
A. Header / Top Navigation Bar
Frame: Header
├── Direction: Horizontal
├── Width: Fill (100%)
├── Height: 56px (fixed)
├── Padding: 0 24px
├── Gap: 24px
├── Alignment: Center (vertical)
├── Fill: #07090F / 92% opacity + blur 20px (glassmorphism)
├── Border-bottom: 1px solid #00D4FF1F
│
├── [Group] Logo                 ← Fixed width: auto
│   ├── Direction: Horizontal
│   ├── Gap: 10px
│   ├── Frame: Icon Box (32×32, radius 8, fill #00D4FF26, stroke #00D4FF4D)
│   └── Frame: Text Stack (Vertical, gap 2px)
│       ├── Text: "DEV Academy"   (Exo 2 Bold 14px, #FFFFFF)
│       └── Text: "TKJ • Jaringan Komputer" (JetBrains Mono 9px, #4A5568)
│
├── [Group] Nav Links            ← Direction: Horizontal, Gap: 4px
│   └── Nav Item (per item)
│       ├── Direction: Horizontal, Gap: 8px
│       ├── Padding: 6px 12px
│       ├── Radius: 8px
│       ├── State Active: Fill #00D4FF1A, Stroke #00D4FF4D
│       ├── State Default: Fill none, hover Fill #FFFFFF0A
│       ├── Icon (16×16)
│       ├── Label (Exo 2 Semibold 13px)
│       └── [Optional] Badge Chip
│           ├── Padding: 2px 6px
│           ├── Radius: 99px
│           └── Text: JetBrains Mono 8px Bold
│
└── [Group] Right Controls       ← Direction: Horizontal, Gap: 12px
    ├── Icon Button (32×32, radius 8, stroke #00D4FF1F)
    ├── Divider (1×20px, fill #00D4FF1F)
    └── User Profile
        ├── Direction: Horizontal, Gap: 8px
        ├── Avatar (32×32 circle, stroke #00D4FF4D)
        ├── Text Stack (Vertical, gap 2px)
        └── Level Badge (24×24, radius 6, fill #F59E0B1A, stroke #F59E0B4D)
B. Sidebar (Crimping Simulator)
Frame: Sidebar
├── Direction: Vertical
├── Width: 288px (fixed)
├── Height: Fill (100vh − 56px)
├── Fill: #0D1525
├── Border-right: 1px solid #00D4FF1F
│
├── [Section] Header Block
│   ├── Padding: 20px
│   ├── Border-bottom: 1px solid #00D4FF14
│   ├── Icon + Title (Horizontal, gap 8px)
│   └── Subtitle (JetBrains Mono 10px, #4A5568)
│
├── [Section] Standard Toggle
│   ├── Padding: 20px
│   ├── Label (JetBrains Mono 10px, #4A5568, uppercase)
│   ├── Toggle Container (Horizontal, gap 4px, padding 4px, radius 8px, fill #07090F)
│   └── Toggle Button × 2
│       ├── Width: Fill (50%)
│       ├── Padding: 8px
│       ├── Radius: 6px
│       ├── State Active: Fill #00D4FF, Text #07090F, glow
│       └── State Default: Fill none, Text #64748B
│
├── [Section] Color Reference      ← Scrollable
│   ├── Padding: 20px
│   ├── Direction: Vertical, Gap: 6px
│   └── Pin Row × 8
│       ├── Direction: Horizontal, Gap: 8px
│       ├── Pin Number (20×20, radius 4, fill #00D4FF14, text #00D4FF, Mono 10px)
│       ├── Wire Chip (Fill, height 20px, radius 4, striped gradient or solid)
│       └── Function Label (JetBrains Mono 9px, #4A5568, width 32px)
│
└── [Section] Instructions        ← Bottom, fixed
    ├── Padding: 20px
    ├── Border-top: 1px solid #00D4FF14
    └── Steps List (Vertical, gap 6px)
        └── Step Item (Horizontal, gap 8px)
            ├── Number (JetBrains Mono 9px, #00D4FF)
            └── Text (JetBrains Mono 9px, #64748B)
C. Module Card (Dashboard Grid)
Frame: Module Card
├── Direction: Vertical
├── Width: Fill (kolom grid)
├── Padding: 20px
├── Gap: 0 (manual spacing antar elemen)
├── Radius: 12px
├── Fill: #0D1525
├── Stroke: 1px #00D4FF1F
├── State Hover: Stroke #00D4FF4D, Fill #111827
├── Clip Content: true (untuk glow blob)
│
├── [Layer] Glow Blob (absolute, top-right)
│   ├── Ellipse 96×96
│   ├── Fill: radial gradient (accent color → transparent)
│   └── Opacity: 0% default → 100% on hover (Smart Animate)
│
├── [Row] Top Meta               ← Horizontal, justify space-between
│   ├── Module Icon (32px, emoji atau SVG)
│   └── Difficulty Chip
│       ├── Padding: 2px 8px
│       ├── Radius: 99px
│       ├── Fill: amber/red/green + 10% opacity
│       └── Text: JetBrains Mono 10px
│
├── [Spacer] 12px
├── Title (Exo 2 Bold 16px, #FFFFFF)
├── [Spacer] 4px
├── Description (Inter 12px, #64748B, max 2 lines)
├── [Spacer] 12px
│
├── [Row] Tags                   ← Horizontal, Gap: 4px, wrap
│   └── Tag Chip
│       ├── Padding: 2px 6px
│       ├── Radius: 4px
│       ├── Fill: #00D4FF0D
│       ├── Stroke: #00D4FF1A
│       └── Text: JetBrains Mono 9px, #4A5568
│
├── [Spacer] 16px
├── [Row] Progress Label         ← Horizontal, justify space-between
│   ├── Text: "Progress" (Mono 10px, #4A5568)
│   └── Percentage (Mono 10px, accent color)
├── [Spacer] 4px
│
├── Progress Bar Container (height 6px, radius 99px, fill #FFFFFF0D)
│   └── Progress Fill (height 6px, radius 99px, fill accent, variable width)
│
├── [Spacer] 16px
└── [Row] Footer                 ← Horizontal, justify space-between
    ├── XP Label (JetBrains Mono 12px, accent color)
    └── CTA Button
        ├── Padding: 6px 12px
        ├── Radius: 8px
        ├── Fill: accent + 10%
        ├── Stroke: accent + 25%
        └── Text: Exo 2 Semibold 12px, accent color
D. RJ45 Connector Canvas (Crimping)
Frame: RJ45 Canvas
├── Direction: Vertical
├── Padding: 24px
├── Gap: 16px
├── Radius: 16px
├── Fill: #0D1525
├── Stroke: 2px #00D4FF33
├── Effect: Drop Shadow (0 0 40px #00D4FF33)
│
├── Label Row (Horizontal, space-between)
│   ├── Text: "← Pin 1" (Mono 10px, #4A5568)
│   └── Text: "Pin 8 →" (Mono 10px, #4A5568)
│
├── Slots Grid (Grid layout, 8 kolom, gap: 8px)
│   └── Pin Slot × 8
│       ├── Width: Fill, Height: 96px
│       ├── Radius: 8px
│       ├── Stroke: 2px dashed #00D4FF33 (empty)
│       ├── Stroke: 2px solid wire-color (filled)
│       ├── State Drop Target: Stroke #00D4FF, Fill #00D4FF1A
│       ├── State Error: Stroke #EF4444, Fill #EF444414
│       ├── State Success: overlay ✓ icon
│       └── Pin Number Label (Mono 9px, #4A5568, below slot)
│
└── Cable Cross-section (Horizontal, gap: 2px)
    └── Wire Strip × 8
        ├── Width: Fixed 28px, Height: 32px
        ├── Radius: 2px
        └── Fill: wire gradient or solid color
E. Leaderboard Widget
Frame: Leaderboard
├── Direction: Vertical
├── Padding: 16px
├── Gap: 0
├── Radius: 12px
├── Fill: #0D1525
├── Stroke: 1px #00D4FF1F
│
├── Header Row (Horizontal, space-between, padding-bottom 16px)
│   ├── Title (Exo 2 Bold 14px, #FFFFFF)
│   └── Class Label (Mono 10px, #4A5568)
│
└── Leaderboard Row × 5 + Current User
    ├── Direction: Horizontal, Gap: 12px
    ├── Padding: 10px
    ├── Radius: 8px
    ├── State #1: Fill #00D4FF14, Stroke #00D4FF26
    ├── State Current: Fill #10B98114, Stroke #10B98133
    │
    ├── Rank (width 24px, Mono 12px Bold, medal emoji atau #N)
    ├── Avatar (28×28 circle, fill #111827, stroke cyan, initials Exo 2 10px Bold)
    ├── Info Stack (Vertical, gap 2px, Fill)
    │   ├── Name (Exo 2 Semibold 12px, #FFFFFF)
    │   └── Level (Mono 9px, #4A5568)
    └── XP Stack (Vertical, gap 2px, align right)
        ├── XP Value (Mono 12px Bold, #00D4FF)
        └── Weekly Delta (Mono 9px, #10B981)
4. Layout Grid Figma (Frame Setup)
Desktop Frame
Frame size: 1440 × 900px
Grid: 12 Columns
├── Margin: 24px kiri-kanan
├── Gutter: 16px
└── Column width: auto (≈ 99px per kolom)

Row Grid: 8px base unit (semua spacing kelipatan 8)
Dashboard Content Area
Main Content: 8 kolom (col 1–8)  → Module grid, Activity
Right Sidebar: 4 kolom (col 9–12) → Leaderboard, Status, Challenge
Crimping Simulator
Left Sidebar: 288px fixed (outside grid)
Main Canvas: remaining width
├── Horizontal padding: 32px
└── Vertical: centered flex
5. Component States (untuk Figma Variants)
Setiap komponen interaktif buat 4 variant:

Default → Hover → Active/Pressed → Disabled
Untuk input dan drop targets:

Empty → Drag-Over → Filled-Correct → Filled-Error
Gunakan Smart Animate di Figma dengan easing Ease Out 200ms untuk semua transisi state.

