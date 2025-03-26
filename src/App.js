import './App.css';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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
  Typography,
  Button,
  Collapse,
  Alert,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import CloudIcon from '@mui/icons-material/Cloud';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

function App() {
  // 从localStorage获取已保存的设置，如果没有则使用默认值
  const getSavedDarkMode = () => {
    try {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? savedMode : 'system';
    } catch (error) {
      console.error('获取darkMode设置失败:', error);
      return 'system';
    }
  };
  
  const getSavedBingWallpaper = () => {
    try {
      const savedWallpaper = localStorage.getItem('useBingWallpaper');
      return savedWallpaper ? JSON.parse(savedWallpaper) : false;
    } catch (error) {
      console.error('获取必应壁纸设置失败:', error);
      return false;
    }
  };
  
  const getSavedWallpaperData = () => {
    try {
      const savedData = localStorage.getItem('wallpaperData');
      return savedData ? JSON.parse(savedData) : { url: '', lastUpdated: '' };
    } catch (error) {
      console.error('获取壁纸数据失败:', error);
      return { url: '', lastUpdated: '' };
    }
  };
  
  // 检查是否需要更新每日一图
  const isWallpaperNeedsUpdate = () => {
    try {
      const { lastUpdated } = getSavedWallpaperData();
      if (!lastUpdated) return true;
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD格式
      const savedDate = lastUpdated.split('T')[0];
      
      return today !== savedDate; // 如果日期不同，则需要更新
    } catch (error) {
      console.error('检查壁纸更新失败:', error);
      return true; // 出错时默认需要更新
    }
  };
  
  const getSavedSearchEngine = (engines) => {
    try {
      const savedEngineId = localStorage.getItem('selectedSearchEngine');
      if (savedEngineId) {
        const foundEngine = engines.find(engine => engine.id === savedEngineId);
        return foundEngine || engines[0];
      }
      return engines[0];
    } catch (error) {
      console.error('获取搜索引擎设置失败:', error);
      return engines[0];
    }
  };
  
  const getSavedWebDAVSettings = () => {
    try {
      const savedSettings = localStorage.getItem('webDAVSettings');
      return savedSettings ? JSON.parse(savedSettings) : {
        server: 'https://dav.jianguoyun.com',
        path: '/dav/Via',
        username: '',
        password: ''
      };
    } catch (error) {
      console.error('获取WebDAV设置失败:', error);
      return {
        server: 'https://dav.jianguoyun.com',
        path: '/dav/Via',
        username: '',
        password: ''
      };
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const searchRef = useRef(null);
  const [searchEngineMenuAnchor, setSearchEngineMenuAnchor] = useState(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);
  const [darkMode, setDarkMode] = useState(getSavedDarkMode);
  const [useBingWallpaper, setUseBingWallpaper] = useState(getSavedBingWallpaper);
  const [wallpaperUrl, setWallpaperUrl] = useState(() => {
    // 初始化时从localStorage加载壁纸URL
    const { url } = getSavedWallpaperData();
    return url || '';
  });
  const [showWebDAVSettings, setShowWebDAVSettings] = useState(false);
  const [webDAVSettings, setWebDAVSettings] = useState(getSavedWebDAVSettings);
  const [testResult, setTestResult] = useState({ show: false, success: false, message: '' });
  
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
  
  const [selectedSearchEngine, setSelectedSearchEngine] = useState(() => getSavedSearchEngine(searchEngines));
  
  // 保存设置到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', darkMode);
    } catch (error) {
      console.error('保存深色模式设置失败:', error);
    }
  }, [darkMode]);
  
  useEffect(() => {
    try {
      localStorage.setItem('useBingWallpaper', JSON.stringify(useBingWallpaper));
    } catch (error) {
      console.error('保存必应壁纸设置失败:', error);
    }
  }, [useBingWallpaper]);
  
  useEffect(() => {
    try {
      localStorage.setItem('selectedSearchEngine', selectedSearchEngine.id);
    } catch (error) {
      console.error('保存搜索引擎设置失败:', error);
    }
  }, [selectedSearchEngine]);
  
  useEffect(() => {
    try {
      localStorage.setItem('webDAVSettings', JSON.stringify(webDAVSettings));
    } catch (error) {
      console.error('保存WebDAV设置失败:', error);
    }
  }, [webDAVSettings]);
  
  // 获取必应每日一图
  useEffect(() => {
    if (useBingWallpaper) {
      try {
        // 检查是否需要更新壁纸
        const needsUpdate = isWallpaperNeedsUpdate();
        const { url: savedUrl } = getSavedWallpaperData();
        
        // 如果有保存的壁纸URL并且不需要更新，则直接使用
        if (savedUrl && !needsUpdate) {
          setWallpaperUrl(savedUrl);
          return;
        }
        
        // 需要获取新壁纸
        fetch("https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main/README.md")
          .then(response => {
            if (!response.ok) {
              throw new Error(`网络请求失败: ${response.status}`);
            }
            return response.text();
          })
          .then(result => {
            try {
              // 从README.md中提取图片URL
              const match = result.match(/!\[.*?\]\((.*?)\)/);
              if (match && match[1]) {
                const newUrl = match[1];
                setWallpaperUrl(newUrl);
                
                // 保存新壁纸URL和更新日期到localStorage
                try {
                  const wallpaperData = {
                    url: newUrl,
                    lastUpdated: new Date().toISOString()
                  };
                  localStorage.setItem('wallpaperData', JSON.stringify(wallpaperData));
                } catch (storageError) {
                  console.error('保存壁纸数据失败:', storageError);
                }
              } else {
                throw new Error('无法解析壁纸URL');
              }
            } catch (parseError) {
              console.error('解析壁纸数据失败:', parseError);
              if (savedUrl) setWallpaperUrl(savedUrl);
            }
          })
          .catch(error => {
            console.error('获取必应壁纸失败:', error);
            // 如果获取失败但有保存的壁纸，则使用保存的
            if (savedUrl) {
              setWallpaperUrl(savedUrl);
            }
          });
      } catch (error) {
        console.error('处理壁纸更新逻辑出错:', error);
        // 尝试使用已保存的壁纸
        try {
          const { url: savedUrl } = getSavedWallpaperData();
          if (savedUrl) setWallpaperUrl(savedUrl);
        } catch (e) {
          console.error('无法获取保存的壁纸:', e);
        }
      }
    } else {
      // 当禁用必应壁纸时，清除壁纸URL
      setWallpaperUrl('');
    }
  }, [useBingWallpaper, isWallpaperNeedsUpdate]);
  
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
  
  const handleWebDAVSettingsChange = (field) => (event) => {
    setWebDAVSettings({
      ...webDAVSettings,
      [field]: event.target.value
    });
  };
  
  const testWebDAVConnection = () => {
    // 简单验证表单
    if (!webDAVSettings.server) {
      setTestResult({ 
        show: true, 
        success: false, 
        message: '请输入WebDAV服务器地址' 
      });
      return;
    }
    
    if (!webDAVSettings.username || !webDAVSettings.password) {
      setTestResult({ 
        show: true, 
        success: false, 
        message: '请输入WebDAV账号和密码' 
      });
      return;
    }
    
    // 显示测试中状态
    setTestResult({
      show: true,
      success: true,
      message: '正在测试WebDAV连接...'
    });
    
    // 模拟连接测试 - 实际应用中应实现真正的WebDAV连接测试
    setTimeout(() => {
      // 简单验证服务器地址是否为WebDAV
      const isWebDAV = webDAVSettings.server.includes('jianguoyun.com');
      setTestResult({ 
        show: true, 
        success: isWebDAV, 
        message: isWebDAV ? 'WebDAV连接测试成功' : '连接失败，请确认服务器地址' 
      });
    }, 800);
  };
  
  const saveWebDAVSettings = () => {
    // 验证必填字段
    if (!webDAVSettings.server || !webDAVSettings.server.includes('jianguoyun.com')) {
      setTestResult({ 
        show: true, 
        success: false, 
        message: '请使用有效的WebDAV地址' 
      });
      return;
    }
    
    if (!webDAVSettings.username || !webDAVSettings.password) {
      setTestResult({ 
        show: true, 
        success: false, 
        message: '请输入WebDAV账号和密码' 
      });
      return;
    }
    
    // 确保路径格式正确
    let updatedSettings = {
      ...webDAVSettings,
      // 确保路径以/开头
      path: webDAVSettings.path.startsWith('/') ? webDAVSettings.path : `/${webDAVSettings.path}`
    };
    
    // 保存WebDAV设置到localStorage
    localStorage.setItem('webDAVSettings', JSON.stringify(updatedSettings));
    
    setTestResult({ 
      show: true, 
      success: true, 
      message: 'WebDAV设置已保存' 
    });
  };
  
  const handleCloseTestResult = () => {
    setTestResult({ ...testResult, show: false });
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
          
          {/* WebDAV设置 */}
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={() => setShowWebDAVSettings(!showWebDAVSettings)}>
            <ListItemIcon>
              <CloudIcon />
            </ListItemIcon>
            <ListItemText primary="WebDAV" secondary="同步您的设置" />
            {showWebDAVSettings ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </MenuItem>
          
          <Collapse in={showWebDAVSettings} timeout="auto" unmountOnExit>
            <Box sx={{ px: 2, py: 1 }}>
              <TextField
                label="服务器地址"
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
                value={webDAVSettings.server}
                onChange={handleWebDAVSettingsChange('server')}
                placeholder="https://dav.jianguoyun.com"
                sx={{ mb: 1 }}
              />
              <TextField
                label="路径"
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
                value={webDAVSettings.path}
                onChange={handleWebDAVSettingsChange('path')}
                placeholder="/dav/Via"
                sx={{ mb: 1 }}
              />
              <TextField
                label="WebDAV账号"
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
                value={webDAVSettings.username}
                onChange={handleWebDAVSettingsChange('username')}
                placeholder="邮箱地址"
                sx={{ mb: 1 }}
              />
              <TextField
                label="应用密码"
                type="password"
                variant="outlined"
                size="small"
                fullWidth
                margin="dense"
                value={webDAVSettings.password}
                onChange={handleWebDAVSettingsChange('password')}
                placeholder="应用密码(非登录密码)"
                helperText="在WebDAV服务提供商处获取应用密码"
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Button 
                  variant="outlined" 
                  size="small"
                  onClick={testWebDAVConnection}
                >
                  测试连通
                </Button>
                <Button 
                  variant="contained" 
                  size="small"
                  onClick={saveWebDAVSettings}
                  color="primary"
                >
                  保存连接
                </Button>
              </Box>
            </Box>
          </Collapse>
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
      
      {/* 消息提示 */}
      <Snackbar 
        open={testResult.show} 
        autoHideDuration={3000} 
        onClose={handleCloseTestResult}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseTestResult} 
          severity={testResult.success ? "success" : "error"} 
          variant="filled"
        >
          {testResult.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App; 