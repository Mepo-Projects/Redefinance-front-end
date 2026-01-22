\# UX Behaviour Specification

\#\# 1\. Dashboard & Selection  
\* \*\*Initial State:\*\* User sees a list of available documents (\`GET /api/documents\`).  
\* \*\*Selection:\*\* User selects 1 or 2 documents. The "Start Analysis" button enables with a smooth opacity transition.  
\* \*\*Transition:\*\* Clicking "Start" triggers \`POST /api/session/create\`. The UI must enter a "Preparing Workspace" state. On success, animate the transition to the Chat View (do not just hard-swap the URL).

\#\# 2\. Active Chat (Blocking API Handling)  
\* \*\*User Input:\*\* On send, the user's message appears instantly. The input field locks (disabled state) to prevent double-submission.  
\* \*\*Thinking State:\*\* An "Assistant" bubble appears immediately with a premium loading animation (e.g., a "shimmer" text effect or a pulsing waveform). This signifies "Reading & Analyzing."  
\* \*\*Response:\*\* When the JSON returns, the "Thinking" bubble transforms into the text response.

\#\# 3\. Session Management  
\* \*\*Manual End:\*\* An "End Session" button is persistent in the header. Clicking it calls \`DELETE /api/session/{id}\` and redirects to the Dashboard.  
\* \*\*Auto-End:\*\* If the session expires (120 mins), the next user action should trigger a polite modal ("Session Expired") and redirect to the Dashboard.