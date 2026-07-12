<div align="center">

# Founders’ Floor

### Build solo. Never build alone.

**The virtual office where solo founders build in public, together.**

<br />

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_Product-111111?style=for-the-badge)](https://founders-floor-buidl-opc-hackathon.vercel.app/)
[![Demo Video](https://img.shields.io/badge/Demo_Video-Watch-111111?style=for-the-badge)](#)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-111111?style=for-the-badge&logo=github)](https://github.com/clover475/Founders-Floor_BUIDL_OPC_HACKATHON_SG)

</div>

---

## What it is

Founders’ Floor is an online workplace and hands-on community for one-person company founders and independent builders.

It gives solo founders both a place to work and a place to take a break, interact, and receive lightweight feedback from other builders.

---

## Why it matters

AI has made solo founders more productive, but it has not given them coworkers, shared routines, or the informal moments that normally happen in an office.

Founders’ Floor recreates those everyday moments online: working alongside others, asking for quick help, taking a short break, practising how to explain an idea, and making progress visible.

---

## Core flow

```text
Clock In
→ Choose a Work Room
→ Build Alongside Others
→ Visit the Break Room
→ Join a Lightweight Activity
→ Return to Work
→ Clock Out and Share What You Shipped
```

---

## Break Room Experiences

The Break Room is not another work area. It is a lightweight social space designed to help founders pause, interact, and return to work with more energy and clarity.

### AI Elevator Pitch Coach

Users can record or enter a Product, Idea, or Founder Pitch.

The AI:

- checks whether the pitch clearly explains the target user, problem, solution, and call to action;
- reviews basic delivery signals such as duration, word count, and filler words;
- gives one priority improvement;
- creates a clearer 30-second rewrite without inventing facts.

### K-PLAY Coffee Break

K-PLAY is a lightweight coffee-break experience inside the Break Room.

It gives founders a simple reason to step away from isolated work, join a short shared interaction, and reconnect with the people working on the same floor before returning to their tasks.

---

## Current MVP

The current demo includes:

- Clock In and Clock Out;
- Idea, Build, Feedback, and Growth rooms;
- founder task and status cards;
- Desk Check;
- Break Room;
- AI Elevator Pitch Coach;
- K-PLAY Coffee Break;
- Ship Wall;
- demo member data and local progress storage.

Some members and interactions currently use demonstration data.

---

## Product vision

Founders’ Floor starts with a virtual office, but the long-term goal is to build a hands-on community for one-person companies.

The platform will combine daily coworking, lightweight social interaction, product feedback, recurring OPC Sprints, Founder Crews, and resource exchange.

---

## Business model

Founders’ Floor plans to use a freemium membership model.

Basic public office and Break Room experiences will remain free. Revenue will mainly come from annual OPC memberships, paid Sprints, and premium Founder Circles for members seeking deeper peer support, product feedback, and long-term founder relationships.

---

## Tech Stack

- **Framework**: Next.js (App Router), React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Real-time / Database**: Supabase Realtime (Presence)
- **AI Integration**: OpenAI-compatible API (configured for DeepSeek or similar models)
- **Video Conferencing**: Jitsi Meet integration
- **Storage**: Browser localStorage for persistence
- **Deployment**: Vercel

---

## Run Locally

```bash
git clone https://github.com/clover475/Founders-Floor_BUIDL_OPC_HACKATHON_SG.git
cd Founders-Floor_BUIDL_OPC_HACKATHON_SG
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# LLM Provider Configuration (e.g. DeepSeek or OpenAI)
LLM_BASE_URL="https://api.deepseek.com/v1"
LLM_API_KEY="sk-..."
LLM_MODEL="deepseek-chat"

# Supabase (For real-time presence)
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Jitsi
NEXT_PUBLIC_JITSI_DOMAIN="meet.jit.si"
```

Do not commit real API keys to GitHub.

---

## Roadmap

### Next

- persistent user accounts;
- real-time presence;
- human Elevator Pitch feedback;
- real product-testing requests;
- topic forums;
- weekly OPC Sprints;
- stable Founder Crews.

### Later

- founder case and opportunity libraries;
- contribution and trust records;
- advanced AI communication feedback;
- online and offline events;
- premium Founder Circles;
- resource exchange and project collaboration.

---

## Open-Source Acknowledgements

The AI Elevator Pitch Coach and real-time infrastructure utilise:

- **Jitsi Meet API**: Video conferencing capabilities.
- **Web Speech API**: Browser-native real-time transcription.
- **Supabase Realtime**: Broadcast presence tracking.

---

## Team

### Clover Li

**Founder / Product & Engineering Lead**

Clover has approximately three years of experience in HR and management consulting, including digital transformation, talent assessment, career development, and B2B project delivery.

She has also worked on AI knowledge-base products, model evaluation, AI product design, and web prototype development.

She is currently pursuing a master’s degree related to Applied Artificial Intelligence at Nanyang Technological University.

For Founders’ Floor, she is responsible for:

- product positioning;
- user problem definition;
- core experience design;
- AI feature design;
- frontend and backend prototype development;
- community model design;
- early user validation.

---

## Contact

**Clover Li**  
Founder / Product & Engineering Lead  
lmnc475@gmail.com

---

## Licence

MIT License
