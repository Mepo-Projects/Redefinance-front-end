\# Design & Visual Guide: "Elegant Accuracy"

\*\*Core Values:\*\* Professionalism, Elegance, Efficiency, Accuracy.

\#\# 1\. The Core Aesthetic (Dark & Flowing)  
\* \*\*Theme:\*\* Dark mode is the default and only theme for the MVP.  
\* \*\*Color Palette:\*\*  
    \* \*\*Backgrounds:\*\* Deep, rich darks (e.g., \`bg-neutral-950\` or slightly desaturated charcoal). Avoid pure \`black\`.  
    \* \*\*Primary Accent:\*\* White (\`text-white\`). Used for high-priority text, active states, and primary buttons.  
    \* \*\*Secondary Accent:\*\* Subtle off-white/light gray (\`text-neutral-400\`) for supporting text.  
\* \*\*Geometry (Flowing Lines):\*\*  
    \* \*\*No Sharp Edges:\*\* Buttons, inputs, chat bubbles, and containers must have significant rounded corners (e.g., Tailwind's \`rounded-xl\` or \`rounded-2xl\`).  
    \* \*\*Borders:\*\* Use extremely subtle, thin borders (\`border border-white/10\`) to define space without creating harsh grids.

\#\# 2\. Animations & Micro-interactions  
Animations are \*\*mandatory\*\* but must be subtly executed to convey professionalism, not distraction.

\* \*\*Global Transition:\*\* Almost all interactive elements should have a base smooth transition (\`transition-all duration-300 ease-out\`).  
\* \*\*Hover States:\*\* Buttons and cards should have a subtle lift or glow effect on hover (e.g., slight \`scale-105\`, increased brightness of border \`border-white/30\`).  
\* \*\*Page Transitions:\*\* Moving from the Dashboard to the Chat view should be a smooth cross-fade or slide-up transition, not an abrupt page reload.  
\* \*\*Loading ("Thinking") State:\*\* This must look premium. Avoid generic spinners. Consider a subtle, pulsing waveform or a shimmering gradient text effect that signifies data processing.

\#\# 3\. Component Specifics & Responsiveness  
\*\*Mandatory:\*\* The entire application must be fully responsive mobile-first.

\* \*\*Layout Structure:\*\*  
    \* \*\*Mobile:\*\* A single-column view. The sidebar is hidden behind a hamburger menu drawer.  
    \* \*\*Desktop:\*\* A fixed sidebar on the left, main content area on the right.  
\* \*\*Chat Interface:\*\*  
    \* \*\*User Bubble:\*\* Dark gray background, rounded corners, right-aligned.  
    \* \*\*Assistant Bubble:\*\* Transparent background, left-aligned. The focus is on the text and the citations.  
    \* \*\*Citations:\*\* These represent "accuracy." They should glow slightly. Perhaps a translucent white pill (\`bg-white/10\`) that brightens on hover.  
    \* \*\*Input Field:\*\* A "floating" rounded container at the bottom of the screen. It should expand smoothly as the user types. The send button should animate from disabled (grey) to enabled (bright white) when text is entered.