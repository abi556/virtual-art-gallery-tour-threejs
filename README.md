# Virtual Art Gallery Tour - Three.js Project

An interactive 3D virtual art gallery built with Three.js, featuring immersive navigation, interactive art pieces, and modern web technologies.

## 🎨 Features

### Core Features
- **3D Gallery Environment**: Immersive 3D space with walls, floor, and lighting
- **Interactive Art Pieces**: 5 unique art pieces with hover effects and click interactions
- **Camera Controls**: OrbitControls for smooth camera navigation
- **Raycasting**: Click and hover detection for art piece interaction
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, intuitive interface with glassmorphism effects

### Technical Features
- **Three.js Integration**: Full 3D rendering with WebGL
- **Lighting System**: Ambient, directional, and spot lighting
- **Shadow Mapping**: Realistic shadows and lighting effects
- **Animation**: Smooth camera movements and object animations
- **Event Handling**: Mouse and keyboard controls
- **Performance Optimized**: Efficient rendering and memory management

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/virtual-art-gallery-tour-threejs.git
   cd virtual-art-gallery-tour-threejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 Controls

### Mouse Controls
- **Left Click + Drag**: Rotate camera around the scene
- **Scroll Wheel**: Zoom in/out
- **Click on Art Pieces**: View detailed information

### Keyboard Controls
- **W/A/S/D**: Move camera forward/left/backward/right
- **Q/E**: Move camera up/down

### UI Controls
- **Reset View**: Return camera to default position
- **Toggle Lights**: Turn gallery lighting on/off
- **Fullscreen**: Enter/exit fullscreen mode

## 🏗️ Project Structure

```
virtual-art-gallery-tour-threejs/
├── index.html              # Main HTML file
├── style.css               # Styles and UI components
├── main.js                 # Three.js application logic
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

### Adding New Art Pieces

To add new art pieces, modify the `artData` array in `main.js`:

```javascript
const artData = [
    {
        title: "Your Art Title",
        artist: "Artist Name",
        year: "2024",
        description: "Art piece description",
        position: [x, y, z],  // 3D coordinates
        color: 0xhexcolor     // Hex color code
    }
    // ... more art pieces
];
```

### Customizing the Gallery

- **Lighting**: Modify `setupLighting()` method in `main.js`
- **Materials**: Change materials in `createArtPiece()` method
- **Camera**: Adjust camera settings in `setupCamera()` method
- **UI**: Customize styles in `style.css`

## 🌐 Deployment

### GitHub Pages

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy automatically**
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages**
   - Go to repository Settings > Pages
   - Select "gh-pages" branch as source
   - Your site will be available at `https://username.github.io/repository-name`

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts** to configure your deployment

### Netlify Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Drag the `dist` folder** to Netlify's deploy area
3. **Your site will be live** with a Netlify URL

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🎯 Learning Objectives Met

This project demonstrates understanding of:

- ✅ **WebGL and Three.js basics**
- ✅ **Object-oriented programming in JavaScript**
- ✅ **Interactive, optimized 3D scenes**
- ✅ **Real-time rendering and animation logic**
- ✅ **Git and project management tools**

### Technical Requirements Fulfilled

- ✅ **5+ unique 3D objects** (4 paintings + 1 sculpture)
- ✅ **Camera controls** (OrbitControls implementation)
- ✅ **Lighting system** (ambient, directional, spot lights)
- ✅ **User interaction** (click, hover, keyboard controls)
- ✅ **Texture mapping** (procedural materials and colors)
- ✅ **Animation** (camera movement, object scaling, rotation)

## 🔧 Troubleshooting

### Common Issues

1. **Three.js not loading**
   - Ensure all dependencies are installed: `npm install`
   - Check browser console for errors

2. **Performance issues**
   - Reduce shadow map resolution in `setupLighting()`
   - Lower polygon count for complex geometries

3. **Mobile responsiveness**
   - Test on different screen sizes
   - Adjust camera controls for touch devices

### Performance Tips

- Use `Object3D` groups for better scene organization
- Implement level-of-detail (LOD) for complex scenes
- Optimize textures and materials
- Use `FrustumCulling` for large scenes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: [Your Name]
- **Course**: Software Engineering Year 3
- **Institution**: [Your University]

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Contact: [your.email@university.edu]

---

**Built with ❤️ using Three.js and modern web technologies**