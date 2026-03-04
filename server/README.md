# 🏒 NHL GM Simulator — Backend

## Быстрый старт

### 1. Открой терминал в VS Code и перейди в папку server:
```bash
cd server
```

### 2. Установи зависимости:
```bash
npm install
```

### 3. Запусти сервер:
```bash
npx ts-node server.ts
```

### 4. Открой в браузере:
```
http://localhost:3001
```

---

## Что произойдёт при запуске

В терминале увидишь:
```
🏒 ═══════════════════════════════════════════════
🏒   NHL GM Simulator — Backend Server
🏒   http://localhost:3001
🏒 ═══════════════════════════════════════════════

📡 API эндпоинты:
   GET  http://localhost:3001/api/status
   GET  http://localhost:3001/api/teams
   GET  http://localhost:3001/api/team/:abbrev
   GET  http://localhost:3001/api/player/:id
   GET  http://localhost:3001/api/standings
   GET  http://localhost:3001/api/search?q=...
   GET  http://localhost:3001/api/leaders?cat=points
   POST http://localhost:3001/api/refresh

⏳ Предзагрузка данных...

📡 ═══════════════════════════════════════════════
📡  Загрузка данных с NHL API...
📡 ═══════════════════════════════════════════════

  ✅ ANA — Anaheim Ducks (24 игроков, 22 с текущей стат., 20 с прошлой)
  ✅ BOS — Boston Bruins (23 игроков, 21 с текущей стат., 22 с прошлой)
  ...

═══════════════════════════════════════════════
✅ Загрузка завершена!
   🏒 Команд:  32 / 32
   👤 Игроков: 750
   ⏱  Время:   25.3 сек
═══════════════════════════════════════════════
```

## Если ошибки

### "Cannot find module 'express'"
```bash
npm install
```

### "Cannot find module 'ts-node'"
```bash
npx ts-node server.ts
```
(npx скачает ts-node автоматически)

### Порт 3001 занят
Измени `const PORT = 3001;` в `server.ts` на другой порт.
