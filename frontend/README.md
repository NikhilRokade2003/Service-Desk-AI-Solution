# Service Desk Triaging Agent - Frontend

Modern React frontend for the AI-powered ticket triaging system.

## Features

- ✅ Real-time ticket triaging with AI
- ✅ Clean, intuitive user interface
- ✅ Health monitoring and system status
- ✅ Confidence scoring visualization
- ✅ Resolution steps display
- ✅ Example tickets for testing
- ✅ Responsive design (mobile-friendly)

## Tech Stack

- **React** 18.2 - UI library
- **Vite** 5.0 - Build tool & dev server
- **Axios** - HTTP client
- **CSS3** - Styling (no frameworks)

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Backend URL

Create `.env` file (or use default):

```bash
# Optional - defaults to http://localhost:8000
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.js          # API client & methods
│   ├── components/
│   │   ├── HealthStatus.jsx   # System health indicator
│   │   ├── TriageForm.jsx     # Ticket submission form
│   │   └── TriageResult.jsx   # Triaging results display
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   ├── index.css              # Global styles
│   └── App.css                # App component styles
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies
```

## API Integration

The frontend connects to the backend at `http://localhost:8000` by default.

### API Endpoints Used

- `GET /api/v1/health` - System health check
- `GET /api/v1/stats` - Agent statistics
- `GET /api/v1/queues` - Available queues
- `POST /api/v1/triage` - Triage a ticket

### Proxy Configuration

Vite dev server proxies `/api/*` requests to the backend automatically:

```js
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```

## Components

### App.jsx
Main application component that:
- Loads health and stats on startup
- Manages triaging workflow
- Switches between form and results

### HealthStatus.jsx
Displays system status:
- Overall health (healthy/degraded)
- Component status (agent, vectors, LLM)
- Real-time updates

### TriageForm.jsx
Ticket submission form with:
- Subject & description fields
- Character count validation
- Example tickets
- Loading states
- Error handling

### TriageResult.jsx
Results display showing:
- Queue assignment
- Category & sub-category
- Confidence score (visual progress bar)
- Recommended action
- Resolution steps
- SOP reference
- AI reasoning

## Environment Variables

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000
```

## Development

### Run Dev Server
```bash
npm run dev
```

### Lint Code
```bash
npm run lint
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Styling

Custom CSS with CSS variables for theming:

```css
:root {
  --primary-color: #2563eb;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  /* ... */
}
```

Responsive breakpoints:
- Desktop: > 768px
- Mobile: ≤ 768px

## Features in Detail

### Confidence Visualization
- **High (≥85%)**: Green bar, auto-resolve recommendation
- **Medium (50-85%)**: Yellow bar, route with suggestion
- **Low (<50%)**: Red bar, escalate to human

### Routing Actions
1. **Auto-Resolve**: High confidence, can be automated
2. **Route with Suggestion**: Medium confidence, AI assists
3. **Escalate to Human**: Low confidence, manual review needed

### Example Tickets
Pre-loaded examples for quick testing:
- VPN access issues
- Password reset requests
- Printer problems

## Troubleshooting

### Cannot connect to backend
- Ensure backend server is running: `python main.py`
- Check backend URL in `.env` file
- Verify CORS is enabled in backend

### Build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (needs v16+)

### Styling issues
- Clear browser cache
- Check CSS file imports
- Verify CSS variables are defined

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions

## License

Proprietary - Jade Global Software Pvt Ltd
