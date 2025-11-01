# Todo App - React Native with Convex Backend

A beautiful, feature-rich todo application built with React Native (Expo) and real-time Convex backend. Features include drag-and-drop reordering, light/dark theme switching, responsive design, and offline detection.

![Todo App Demo](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB?logo=react)
![Convex](https://img.shields.io/badge/Backend-Convex-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)

## ✨ Features

- ✅ **CRUD Operations** - Create, read, update, and delete todos
- ✅ **Real-time Sync** - Changes sync instantly across all devices using Convex
- ✅ **Drag & Drop** - Reorder todos with smooth animations
- ✅ **Light/Dark Theme** - Toggle between themes with smooth transitions
- ✅ **Theme Persistence** - Your theme choice is remembered
- ✅ **Filter Todos** - View All, Active, or Completed todos
- ✅ **Responsive Design** - Optimized for mobile and desktop
- ✅ **Offline Detection** - Visual feedback when offline
- ✅ **Error Handling** - Comprehensive error messages and validation
- ✅ **Character Counter** - Real-time input validation (max 200 chars)
- ✅ **Pixel-Perfect UI** - Matches Figma design specifications

## 🛠️ Technology Stack

### Frontend
- **React Native** (Expo Router) - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **Expo Linear Gradient** - Beautiful gradient backgrounds
- **React Native Gesture Handler** - Smooth drag-and-drop
- **React Native Reanimated** - Performance animations
- **AsyncStorage** - Local data persistence

### Backend
- **Convex** - Real-time backend-as-a-service
- Real-time database with automatic sync
- Type-safe API with automatic TypeScript generation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or newer) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Expo CLI** - Will be installed with dependencies
- **Git** - [Download here](https://git-scm.com/)

Optional for mobile testing:
- **Expo Go** app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
- **iOS Simulator** (Mac only) or **Android Emulator**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/todo-app-react-native.git
cd todo-app-react-native
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Convex Backend

#### a. Install Convex CLI (if not already installed)
```bash
npm install -g convex
```

#### b. Login to Convex
```bash
npx convex dev
```

This will:
- Open your browser to log in (create a free account if needed)
- Create a new Convex project
- Generate the `convex/_generated/` folder
- Start the Convex development server

#### c. Get Your Convex Deployment URL
After running `npx convex dev`, you'll see output like:
```
✔ Deployment URL: https://your-project-name.convex.cloud
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
EXPO_PUBLIC_CONVEX_URL=https://your-project-name.convex.cloud
```

Replace `https://your-project-name.convex.cloud` with your actual Convex deployment URL from step 3c.

### 5. Add Background Images

Place your background images in `app/assets/images/`:
- `webl.png` - Light mode web/desktop background
- `mobl.jpg` - Light mode mobile background
- `webd.jpg` - Dark mode web/desktop background
- `mobd.jpg` - Dark mode mobile background

## 🏃‍♂️ Running the App

### Start Development Server

In one terminal, start Convex:
```bash
npx convex dev
```

In another terminal, start Expo:
```bash
npx expo start
```

### Run on Different Platforms

After running `npx expo start`, you'll see options:

- Press `w` - Open in **web browser**
- Press `i` - Open in **iOS Simulator** (Mac only)
- Press `a` - Open in **Android Emulator**
- Scan QR code - Open in **Expo Go** app on your phone

### Clear Cache (if needed)

If you encounter issues:
```bash
npx expo start --clear
```

## 📁 Project Structure

```
todo-app/
├── app/                          # Application screens
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── index.tsx             # Main todo screen
│   │   └── _layout.tsx           # Tab layout configuration
│   └── _layout.tsx               # Root layout with Convex provider
├── assets/                       # Static assets
│   └── images/                   # Background images
│       ├── webl.png              # Light mode desktop bg
│       ├── mobl.jpg              # Light mode mobile bg
│       ├── webd.jpg              # Dark mode desktop bg
│       └── mobd.jpg              # Dark mode mobile bg
├── convex/                       # Convex backend
│   ├── _generated/               # Auto-generated types (gitignored)
│   ├── schema.ts                 # Database schema
│   ├── todos.ts                  # Todo CRUD operations
│   └── tsconfig.json             # Convex TypeScript config
├── .env.local                    # Environment variables (gitignored)
├── .gitignore                    # Git ignore rules
├── app.json                      # Expo configuration
├── babel.config.js               # Babel configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## 🎮 Usage Guide

### Adding a Todo
1. Type your todo in the input field at the top
2. Press Enter or Return to submit
3. Maximum 200 characters allowed

### Completing a Todo
- Click/tap the circle checkbox next to any todo

### Deleting a Todo
- **Desktop:** Hover over the todo and click the ✕ button
- **Mobile:** The ✕ button is always visible

### Reordering Todos
⚠️ **Important:** Reordering only works in "All" view
- **Desktop:** Hover over a todo, then drag the ☰ handle
- **Mobile:** Long-press on the todo text, then drag

### Filtering Todos
- Click **All** to see all todos
- Click **Active** to see incomplete todos
- Click **Completed** to see completed todos

### Clearing Completed Todos
- Click "Clear Completed" in the footer
- Confirm the deletion when prompted

### Theme Switching
- Click the 🌙/☀️ icon in the top-right header
- Your preference is saved automatically

## 🔧 Build Commands

### Build for Production

**Web:**
```bash
npx expo export --platform web
```

**iOS:**
```bash
eas build --platform ios
```

**Android:**
```bash
eas build --platform android
```

**Note:** iOS and Android builds require an Expo account. Sign up at [expo.dev](https://expo.dev).

## 🌐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_CONVEX_URL` | Your Convex deployment URL | `https://your-project.convex.cloud` |

⚠️ **Never commit `.env.local` to version control!**

## 🐛 Troubleshooting

### Issue: "Could not find public function for 'todos:reorderTodos'"
**Solution:** Make sure your Convex dev server is running (`npx convex dev`) and the schema has been pushed.

### Issue: Todos not syncing
**Solution:** 
1. Check your internet connection
2. Verify `.env.local` has the correct Convex URL
3. Restart Convex dev server: `npx convex dev`
4. Restart Expo: `npx expo start --clear`

### Issue: Drag and drop not working
**Solution:** 
1. Ensure you're viewing "All" todos (not filtered)
2. On desktop, drag the ☰ handle
3. On mobile, long-press the todo text

### Issue: Theme not persisting
**Solution:** Clear app storage/cache and try again

### Issue: Build errors with reanimated
**Solution:** Ensure `babel.config.js` has the reanimated plugin as the last plugin

## 📝 API Reference

### Convex Queries

#### `getTodos`
Fetches all todos sorted by order
```typescript
const todos = useQuery(api.todos.getTodos);
```

### Convex Mutations

#### `createTodo`
Creates a new todo
```typescript
await createTodo({ title: "Buy groceries" });
```

#### `updateTodo`
Updates a todo's completion status
```typescript
await updateTodo({ id: todoId, completed: true });
```

#### `deleteTodo`
Deletes a specific todo
```typescript
await deleteTodo({ id: todoId });
```

#### `clearCompleted`
Deletes all completed todos
```typescript
await clearCompleted();
```

#### `reorderTodos`
Updates the order of multiple todos
```typescript
await reorderTodos({ 
  updates: [
    { id: todo1Id, order: 0 },
    { id: todo2Id, order: 1 }
  ] 
});
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@uchedivine](https://github.com/uchedivine)
- Email: uchedivine65@gmail.com

## 🙏 Acknowledgments

- Design inspiration from [Frontend Mentor](https://www.frontendmentor.io/)
- Icons from system emojis
- Backend powered by [Convex](https://www.convex.dev/)
- Built with [Expo](https://expo.dev/)

## 📸 Screenshots

### Light Mode
![alt text](image-1.png)
### Dark Mode
![alt text](image.png)
---

**Built with ❤️ using React Native and Convex**