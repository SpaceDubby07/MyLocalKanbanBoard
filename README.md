# My Local Kanban Board

A simple, lightweight, offline-first task board inspired by Trello, built with **Next.js**, **shadcn/ui**, **Tailwind CSS**, and local file persistence.

Perfect for personal use: track tasks in "Today", "This Week", "Future", and "Completed" columns. Everything is stored in a single `boards.json` file on your computer — no accounts, no cloud, no tracking.

## Features

- Multiple boards with sidebar navigation
- Three active columns + a dedicated "Completed" archive column
- Drag-and-drop tasks between columns (native HTML5 Drag & Drop)
- Collapsible columns
- Mark tasks complete (checkbox) without auto-moving
- Manually move finished tasks to "Completed" when you're ready
- Dark theme by default
- Fully offline & local (data saved to `./data/boards.json` in dev, or user data folder in packaged versions)
- Compact, modern UI with shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 14+ (App Router)
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: lucide-react
- **Persistence**: Plain JSON file on disk (no database)
- **Drag & Drop**: Native HTML5 Drag and Drop API (no external libraries)

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or pnpm
