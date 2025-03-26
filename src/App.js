import './App.css';
import { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment,
  Container,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Switch,
  FormControlLabel,
  Divider,
  useMediaQuery,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Paper,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);
  const [searchEngineMenuAnchor, setSearchEngineMenuAnchor] = useState(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState('system');
  const [useBingWallpaper, setUseBingWallpaper] = useState(false);
  const [wallpaperUrl, setWallpaperUrl] = useState('');
  
  // 系统深色模式检测
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // 实际的深色模式状态
  const actualDarkMode = 
    darkMode === 'system' ? prefersDarkMode : 
    darkMode === 'dark';
  
  // 创建主题
  const theme = createTheme({
    palette: {
      mode: actualDarkMode ? 'dark' : 'light',
    },
  });
  
  // 搜索引擎配置
  const searchEngines = [
    { 
      id: 'bing', 
      name: '必应', 
      url: 'https://www.bing.com/search?q=', 
      logo: 'https://www.bing.com/sa/simg/favicon-2x.ico',
      color: '#008373'
    },
    { 
      id: 'google', 
      name: 'Google', 
      url: 'https://www.google.com/search?q=', 
      logo: 'https://www.google.com/favicon.ico',
      color: '#4285F4'
    },
    { 
      id: 'baidu', 
      name: '百度', 
      url: 'https://www.baidu.com/s?wd=', 
      logo: 'https://www.baidu.com/favicon.ico',
      color: '#2932E1'
    },
    { 
      id: 'sogou', 
      name: '搜狗', 
      url: 'https://www.sogou.com/web?query=', 
      logo: 'https://www.sogou.com/favicon.ico',
      color: '#FB6022'
    }
  ];
  
  const [selectedSearchEngine, setSelectedSearchEngine] = useState(searchEngines[0]);
  
  // 获取必应每日一图
  useEffect(() => {
    if (useBingWallpaper) {
      fetch("https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main/README.md")
        .then(response => response.text())
        .then(result => {
          // 从README.md中提取图片URL
          const match = result.match(/!\[.*?\]\((.*?)\)/);
          if (match && match[1]) {
            setWallpaperUrl(match[1]);
          }
        })
        .catch(error => console.log('获取必应壁纸失败:', error));
    }
  }, [useBingWallpaper]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      // 使用选定的搜索引擎在新窗口中进行搜索
      window.open(`${selectedSearchEngine.url}${encodeURIComponent(searchTerm)}`, '_blank');
    }
  };
  
  const handleSearchIconClick = () => {
    if (searchTerm.trim() !== '') {
      // 使用选定的搜索引擎在新窗口中进行搜索
      window.open(`${selectedSearchEngine.url}${encodeURIComponent(searchTerm)}`, '_blank');
    }
  };
  
  const handleSearchEngineMenuOpen = (event) => {
    setSearchEngineMenuAnchor(event.currentTarget);
  };
  
  const handleSearchEngineMenuClose = () => {
    setSearchEngineMenuAnchor(null);
  };
  
  const handleSearchEngineSelect = (engine) => {
    setSelectedSearchEngine(engine);
    handleSearchEngineMenuClose();
  };
  
  const handleSettingsMenuOpen = (event) => {
    setSettingsMenuAnchor(event.currentTarget);
  };
  
  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchor(null);
  };
  
  const handleDarkModeChange = (mode) => {
    setDarkMode(mode);
    handleSettingsMenuClose();
  };
  
  const handleBingWallpaperToggle = () => {
    setUseBingWallpaper(!useBingWallpaper);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: useBingWallpaper && wallpaperUrl ? `url(${wallpaperUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
          height: '100vh',
          width: '100vw'
        }}
      />
      
      {/* 仅保留右上角设置按钮 */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 100 }}>
        <IconButton 
          onClick={handleSettingsMenuOpen} 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' } 
          }}
        >
          <SettingsIcon sx={{ color: useBingWallpaper ? 'white' : undefined }} />
        </IconButton>
        <Menu
          anchorEl={settingsMenuAnchor}
          open={Boolean(settingsMenuAnchor)}
          onClose={handleSettingsMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { 
              minWidth: 250,
              maxWidth: 350,
              borderRadius: 2,
              p: 1
            }
          }}
        >
          <MenuItem>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              深色模式
            </Typography>
          </MenuItem>
          <MenuItem dense onClick={() => handleDarkModeChange('system')} selected={darkMode === 'system'}>
            <ListItemIcon>
              <BrightnessAutoIcon />
            </ListItemIcon>
            <ListItemText>跟随系统</ListItemText>
          </MenuItem>
          <MenuItem dense onClick={() => handleDarkModeChange('light')} selected={darkMode === 'light'}>
            <ListItemIcon>
              <LightModeIcon />
            </ListItemIcon>
            <ListItemText>浅色模式</ListItemText>
          </MenuItem>
          <MenuItem dense onClick={() => handleDarkModeChange('dark')} selected={darkMode === 'dark'}>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText>深色模式</ListItemText>
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <MenuItem>
            <FormControlLabel
              control={
                <Switch 
                  checked={useBingWallpaper}
                  onChange={handleBingWallpaperToggle}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WallpaperIcon fontSize="small" />
                  <Typography>必应每日一图</Typography>
                </Box>
              }
            />
          </MenuItem>
        </Menu>
      </Box>
      
      {/* 主要搜索区域 */}
      <Container maxWidth="md" sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh',
        py: 3
      }}>
        <Box component="form" onSubmit={handleSearch} sx={{ width: '100%', maxWidth: 600, position: 'relative' }}>
          <Paper 
            ref={searchRef} 
            elevation={3}
            sx={{ 
              borderRadius: 28,
              backgroundColor: actualDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              boxShadow: useBingWallpaper ? '0 4px 20px rgba(0, 0, 0, 0.2)' : undefined,
              position: 'relative',
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: actualDarkMode 
                  ? '0 0 15px 5px rgba(100, 181, 246, 0.6), 0 0 30px 10px rgba(100, 181, 246, 0.2)' 
                  : '0 0 15px 5px rgba(33, 150, 243, 0.4), 0 0 30px 10px rgba(33, 150, 243, 0.1)'
              },
              // 荧光脉冲动画效果
              '@keyframes pulse': {
                '0%': {
                  boxShadow: actualDarkMode 
                    ? '0 0 10px 2px rgba(100, 181, 246, 0.3)' 
                    : '0 0 10px 2px rgba(33, 150, 243, 0.2)'
                },
                '50%': {
                  boxShadow: actualDarkMode 
                    ? '0 0 15px 5px rgba(100, 181, 246, 0.6)' 
                    : '0 0 15px 5px rgba(33, 150, 243, 0.4)'
                },
                '100%': {
                  boxShadow: actualDarkMode 
                    ? '0 0 10px 2px rgba(100, 181, 246, 0.3)' 
                    : '0 0 10px 2px rgba(33, 150, 243, 0.2)'
                }
              },
              animation: 'pulse 3s infinite'
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="搜索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton onClick={handleSearchEngineMenuOpen} aria-label="选择搜索引擎" size="small">
                      <Avatar 
                        src={selectedSearchEngine.logo} 
                        alt={selectedSearchEngine.name}
                        sx={{ 
                          width: 24, 
                          height: 24,
                          bgcolor: selectedSearchEngine.color
                        }}
                      >
                        {selectedSearchEngine.name.charAt(0)}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={searchEngineMenuAnchor}
                      open={Boolean(searchEngineMenuAnchor)}
                      onClose={handleSearchEngineMenuClose}
                    >
                      {searchEngines.map((engine) => (
                        <MenuItem 
                          key={engine.id}
                          onClick={() => handleSearchEngineSelect(engine)}
                          selected={selectedSearchEngine.id === engine.id}
                        >
                          <ListItemIcon>
                            <Avatar 
                              src={engine.logo} 
                              alt={engine.name}
                              sx={{ 
                                width: 24, 
                                height: 24,
                                bgcolor: engine.color
                              }}
                            >
                              {engine.name.charAt(0)}
                            </Avatar>
                          </ListItemIcon>
                          <ListItemText>{engine.name}</ListItemText>
                        </MenuItem>
                      ))}
                    </Menu>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearchIconClick} size="small">
                      <SearchIcon sx={{ 
                        color: actualDarkMode ? 'white' : 'rgba(0, 0, 0, 0.54)',
                        fontSize: '1.2rem'
                      }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 28,
                  py: 0.5,
                  pr: 0.5,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                  color: actualDarkMode ? 'white' : 'black',
                  '& input::placeholder': {
                    color: actualDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                    opacity: 1
                  },
                  '& .MuiSvgIcon-root': {
                    color: actualDarkMode ? 'white' : 'rgba(0, 0, 0, 0.54)',
                  }
                }
              }}
            />
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 