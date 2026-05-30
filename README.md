# Prompt Playground

A scientific experimentation environment for Claude system prompts.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Anthropic](https://img.shields.io/badge/Anthropic_Claude-1A1A1A?style=for-the-badge&logo=anthropic&logoColor=D6D6D6)

```text
┌─────────────────────────────────────────────────────┐
│ Prompt Playground                                   │
├──────────────┬──────────────────────┬───────────────┤
│ System A     │    User Message      │ System B      │
│ "Be concise" │ "Explain quantum..." │ "Be detailed" │
├──────────────┴──────────────────────┴───────────────┤
│ Response A                          Response B      │
│ Quantum mechanics is...             Quantum is a... │
│ ⭐⭐⭐⭐☆                             ⭐⭐⭐☆☆        │
└─────────────────────────────────────────────────────┘
```

## The Core Problem
Prompt engineering without rigorous evaluation is just guessing. Prompt Playground brings an engineering mindset to interacting with Large Language Models. Instead of endlessly tweaking a prompt and trusting a gut feeling about whether the output improved, this app lets you run side-by-side experiments, test across diverse edge cases simultaneously, and mathematically grade the results.

## Features by Stage

*   **Stage 1: Instant Feedback (Single Mode)**
    Test a system prompt against a single user message and instantly review the output alongside exact token usage counts.
*   **Stage 2: Parallel Execution (A/B Compare)**
    Fire two different system prompts at the same time using a shared user message. Both requests execute simultaneously (`Promise.all()`), eliminating wait times and surfacing exactly how the model's behavior shifts.
*   **Stage 3: Quantifiable Results (Manual Scoring)**
    Grade responses on a 1-5 star scale. The app tracks a running history of your experiments, logging winners, ties, and maintaining an overall leaderboard with average scores.
*   **Stage 4: Persistent Storage (Prompt Library)**
    Save, load, and manage your best system prompts using local storage. The app ships pre-seeded with four highly-tuned starter prompts to get you experimenting immediately.
*   **Stage 5: Edge Case Testing (Batch Evaluation)**
    Subject a single system prompt to multiple edge cases simultaneously. Using `Promise.allSettled()`, the app fires up to 5 concurrent test inputs, mapping independent success or failure states to a clean grid.
*   **Stage 6: LLM-as-a-Judge (AI Scoring)**
    Automate your evaluations. Provide a custom grading rubric and let Claude analyze the outputs itself, explicitly highlighting the winner and returning a detailed rationale alongside AI-assigned (🤖) star ratings.

## Why I Built This
As a CS student diving into AI engineering, I realized how unscientific the standard chat interface is for developing serious AI applications. I built Prompt Playground to solve my own frustration with "vibes-based" prompt testing and to force myself to treat prompt iteration as a measurable discipline.

## Tech Stack

| Technology | Purpose | Why I chose it |
| :--- | :--- | :--- |
| **React** | Frontend Framework | Component-based state management is perfect for handling complex, multi-pane UI states without tangled DOM manipulation. |
| **Vite** | Build Tool | Lightning-fast HMR and seamless local development out of the box. |
| **Tailwind CSS** | Styling | Utility classes let me rapidly iterate on a dark, premium aesthetic without switching context. |
| **Anthropic API** | Intelligence Layer | Claude 3.5 Sonnet provides the best reasoning capabilities, especially crucial for the LLM-as-a-judge functionality. |
| **`localStorage`** | Persistence | Keeps the app entirely client-side and frictionless; no backend, databases, or auth required. |
| **`Promise.all` & `allSettled`** | Concurrent Execution | Drastically reduces wait times when running A/B comparisons or batch evaluations, ensuring independent failure handling. |

## Get It Running in 2 Minutes

Prerequisites: Node.js 18+ and an Anthropic API key from [console.anthropic.com](https://console.anthropic.com/).

Note: The app runs entirely in your browser. No `.env` file is required—you enter your API key directly into the UI, where it is securely stored in your local browser storage.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/aksheenrathod/prompt-playground.git
    cd prompt-playground
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Start the dev server**
    ```bash
    npm run dev
    ```
4.  **Open the app**
    Navigate to `http://localhost:5173`
5.  **Connect Claude**
    Paste your API key into the top input field.

## Experiment Workflows

*   **A/B Testing**: Navigate to the A/B Compare tab. Load "Formal Assistant" into Prompt A and "Casual Friend" into Prompt B. Ask a complex question like "Explain black holes" to see stark stylistic differences instantly.
*   **Batch Evaluation**: Move to the Batch Eval tab. Write a highly restrictive system prompt (e.g., "Output ONLY valid JSON"). Hit run, and watch it get tested against normal requests, adversarial edge cases, and short questions simultaneously.
*   **AI Judge**: Run an A/B test. In the "AI Judge Criteria" box, type "Grade strictly on brevity and lack of conversational filler." Click Auto-Score, and read exactly why the AI preferred one over the other.

## Genuine Technical Learnings

*   **`Promise.all` vs `Promise.allSettled`**: I learned the critical difference between the two when handling concurrent API calls. If one request in an A/B test fails, `Promise.all` rejects entirely, but `allSettled` allows batch evaluations to continue rendering successful calls even if one edge case timeouts or errors.
*   **LLM-as-a-Judge Pattern**: I discovered that coercing Claude into outputting strict XML structures (`<scoreA>...</scoreA>`) makes parsing automated evaluations reliable and scalable without needing complex JSON-mode configurations.
*   **Prompt Engineering as a Discipline**: Building this app shifted my mindset from casually talking to an AI to systematically engineering constraints and testing them against hard boundaries.
*   **React Custom Hooks**: Encapsulating the Anthropic API logic into a `useClaudeAPI` hook massively cleaned up my component logic, keeping the loading, error, and response states modular.
*   **LocalStorage Patterns**: I learned how to seamlessly synchronize React state with `localStorage` via `useEffect`, creating a persistent user experience without writing a single line of backend code.

## Future Iterations

*   Export run history and A/B test logs to a downloadable CSV file.
*   Add adjustable `temperature`, `max_tokens`, and `top_p` controls directly in the UI.
*   Implement URL-based prompt sharing to let users send custom prompts to friends.
*   Deploy a Node.js backend to support user accounts, team workspaces, and server-side secret management.

## License
MIT License - Aksheen Rathod
