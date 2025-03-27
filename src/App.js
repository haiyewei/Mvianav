/*
 * Mvianav - 现代化的导航起始页
 * https://github.com/haiyewei/Mvianav
 * 
 * MIT License
 * Copyright (c) 2023-2024 Mvianav
 * 
 * 这是一个基于React开发的现代化导航起始页，提供了美观实用的搜索界面、
 * 个性化设置和云同步功能。
 */

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
  const [wallpaperOpacity, setWallpaperOpacity] = useState(getSavedBingWallpaper() ? 1 : 0);
  const [wallpaperUrl, setWallpaperUrl] = useState(() => {
    // 初始化时从localStorage加载壁纸URL
    const { url } = getSavedWallpaperData();
    return url || '';
  });
  const [showWebDAVSettings, setShowWebDAVSettings] = useState(false);
  const [showSyncOptions, setShowSyncOptions] = useState(false);
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
  
  // 彩虹颜色定义
  const rainbowColors = [
    '#FF0000', // 红
    '#FF7F00', // 橙
    '#FFFF00', // 黄
    '#00FF00', // 绿
    '#00FFFF', // 青
    '#0000FF', // 蓝
    '#8B00FF'  // 紫
  ];
  
  const [selectedSearchEngine, setSelectedSearchEngine] = useState(() => getSavedSearchEngine(searchEngines));
  // 添加颜色状态
  const [logoColorIndices, setLogoColorIndices] = useState([0, 1, 2, 3, 4, 5, 6]);
  // 新增：存储Logo首字母M的当前颜色
  const mColor = rainbowColors[logoColorIndices[0]];
  // 添加颜色变化方向状态
  const [colorChangeDirection, setColorChangeDirection] = useState(() => {
    try {
      const savedDirection = localStorage.getItem('colorChangeDirection');
      return savedDirection ? JSON.parse(savedDirection) : 'backward'; // 默认向后
    } catch (error) {
      console.error('获取颜色变化方向设置失败:', error);
      return 'backward';
    }
  });
  // 添加长按状态
  const [isLongPress, setIsLongPress] = useState(false);
  // 添加动画状态
  const [showAnimation, setShowAnimation] = useState(false);
  // 添加动画方向状态
  const [animationDirection, setAnimationDirection] = useState('backward');
  
  // 长按定时器引用
  const longPressTimerRef = useRef(null);
  
  // 处理Logo点击的函数
  const handleLogoClick = () => {
    if (colorChangeDirection === 'backward') {
      // 循环向后移动颜色：每个颜色索引-1，如果小于0则回到6
      setLogoColorIndices(prevIndices => {
        const newIndices = prevIndices.map(index => (index - 1 + 7) % 7);
        return newIndices;
      });
    } else {
      // 循环向前移动颜色：每个颜色索引+1，如果大于6则回到0
      setLogoColorIndices(prevIndices => {
        const newIndices = prevIndices.map(index => (index + 1) % 7);
        return newIndices;
      });
    }
  };
  
  // 处理Logo按下的函数
  const handleLogoMouseDown = (e) => {
    // 防止文本选择
    e.preventDefault();
    
    // 设置长按定时器
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      // 切换颜色变化方向
      const newDirection = colorChangeDirection === 'backward' ? 'forward' : 'backward';
      setColorChangeDirection(newDirection);
      
      // 设置动画方向和显示动画
      setAnimationDirection(newDirection);
      setShowAnimation(true);
      
      // 动画完成后关闭
      setTimeout(() => {
        setShowAnimation(false);
      }, 1000); // 动画持续1秒
      
      // 保存设置到localStorage
      try {
        localStorage.setItem('colorChangeDirection', JSON.stringify(newDirection));
      } catch (error) {
        console.error('保存颜色变化方向设置失败:', error);
      }
    }, 800); // 长按时间阈值800毫秒
  };
  
  // 处理Logo释放的函数
  const handleLogoMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // 如果不是长按，则执行普通点击
    if (!isLongPress) {
      handleLogoClick();
    }
    
    setIsLongPress(false);
  };
  
  // 处理Logo离开的函数
  const handleLogoMouseLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setIsLongPress(false);
  };
  
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
        const fetchWallpaper = (retryCount = 0) => {
          fetch("https://raw.onmicrosoft.cn/Bing-Wallpaper-Action/main/README.md")
            .then(response => {
              if (!response.ok) {
                throw new Error(`网络请求失败: ${response.status} ${response.statusText}`);
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
              console.error(`获取必应壁纸失败 (尝试 ${retryCount + 1}/3):`, error);
              
              // 如果失败次数小于3次，则进行重试
              if (retryCount < 2) {
                setTimeout(() => {
                  fetchWallpaper(retryCount + 1);
                }, 1000 * (retryCount + 1)); // 逐渐增加重试间隔
              } else {
                // 最终失败，使用保存的壁纸（如果有）
                if (savedUrl) {
                  setWallpaperUrl(savedUrl);
                  console.log('使用缓存的壁纸');
                }
              }
            });
        };
        
        // 开始获取壁纸
        fetchWallpaper();
        
      } catch (error) {
        console.error('处理壁纸更新逻辑出错:', error);
        // 尝试使用已保存的壁纸
        try {
          const { url: savedUrl } = getSavedWallpaperData();
          if (savedUrl) {
            setWallpaperUrl(savedUrl);
            console.log('因错误使用缓存的壁纸');
          }
        } catch (e) {
          console.error('无法获取保存的壁纸:', e);
        }
      }
    } else {
      // 当禁用必应壁纸时，清除壁纸URL
      setWallpaperUrl('');
    }
  }, [useBingWallpaper, isWallpaperNeedsUpdate]);
  
  // 当壁纸URL更新时，如果开启了壁纸功能，则淡入显示
  useEffect(() => {
    if (useBingWallpaper && wallpaperUrl) {
      setWallpaperOpacity(1);
    }
  }, [wallpaperUrl, useBingWallpaper]);
  
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
    if (useBingWallpaper) {
      // 关闭壁纸时，先淡出再更新状态
      setWallpaperOpacity(0);
      setTimeout(() => {
        setUseBingWallpaper(false);
      }, 500); // 与CSS过渡时间匹配
    } else {
      // 开启壁纸时，先更新状态再淡入
      setUseBingWallpaper(true);
      setTimeout(() => {
        setWallpaperOpacity(1);
      }, 50); // 短暂延迟确保状态更新
    }
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
      // 验证服务器地址是否包含有效URL格式
      const isValidURL = webDAVSettings.server.startsWith('http://') || webDAVSettings.server.startsWith('https://');
      setTestResult({ 
        show: true, 
        success: isValidURL, 
        message: isValidURL ? 'WebDAV连接测试成功' : '连接失败，请确认服务器地址格式' 
      });
    }, 800);
  };
  
  const saveWebDAVSettings = () => {
    // 验证必填字段
    if (!webDAVSettings.server || !(webDAVSettings.server.startsWith('http://') || webDAVSettings.server.startsWith('https://'))) {
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
          width: '100vw',
          opacity: wallpaperOpacity,
          transition: 'opacity 500ms ease-in-out'
        }}
      />
      
      {/* 定义全局关键帧动画 */}
      <Box
        sx={{
          '@keyframes rainbow-sweep-left': {
            '0%': {
              clipPath: 'inset(0 100% 0 0)',
              opacity: 0.9
            },
            '100%': {
              clipPath: 'inset(0 0 0 0)',
              opacity: 0
            }
          },
          '@keyframes rainbow-sweep-right': {
            '0%': {
              clipPath: 'inset(0 0 0 100%)',
              opacity: 0.9
            },
            '100%': {
              clipPath: 'inset(0 0 0 0)',
              opacity: 0
            }
          }
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
          
          {/* 同步数据菜单 */}
          <Divider sx={{ my: 1 }} />
          <MenuItem onClick={() => setShowSyncOptions(!showSyncOptions)}>
            <ListItemIcon>
              <CloudIcon />
            </ListItemIcon>
            <ListItemText primary="同步数据" secondary="管理您的同步设置" />
            {showSyncOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </MenuItem>
          
          <Collapse in={showSyncOptions} timeout="auto" unmountOnExit>
            <Box sx={{ px: 2, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button 
                variant="outlined" 
                size="small"
                fullWidth
                startIcon={<CloudIcon />}
              >
                从云端同步
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                fullWidth
                startIcon={<CloudIcon />}
              >
                同步到云端
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                fullWidth
                startIcon={<CloudIcon />}
              >
                导入浏览器
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                fullWidth
                startIcon={<CloudIcon />}
              >
                导出浏览器
              </Button>
              <Button 
                variant="outlined" 
                size="small"
                fullWidth
                startIcon={<CloudIcon />}
              >
                从云端导出
              </Button>
            </Box>
          </Collapse>
        </Menu>
      </Box>
      
      {/* 主要搜索区域 */}
      <Container maxWidth="md" sx={{ 
        height: '100vh',
        position: 'relative'
      }}>
        {/* 搜索框居中定位 */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: { xs: '90%', sm: '95%', md: '100%' }, // 移动端减小宽度，避免铺满屏幕
          maxWidth: '100%'
        }}>
          {/* Mvianav 文字Logo - 移动端单独定位 */}
          <Box
            sx={{
              position: { xs: 'static', sm: 'relative', md: 'relative' }, // 移动端使用static，平板和桌面端使用relative定位，以便放置动画
              top: { xs: 'auto', sm: 'auto', md: 'auto' }, // 移动端不使用固定top值
              left: { xs: 'auto', sm: 'auto', md: 'auto' },
              transform: { 
                xs: 'none', 
                sm: 'translateY(-90%)', 
                md: 'translateY(-90%)' 
              }, // 移动端不需要平移
              display: 'flex', 
              justifyContent: 'center',
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 500,
              fontSize: { xs: '5rem', sm: '6rem', md: '7rem' },
              letterSpacing: '-2px',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              width: { xs: '75%', sm: '75%', md: '75%' }, // 保持与搜索框的宽度比例为1.5:2
              maxWidth: 450, // 600(搜索框最大宽度) * 0.75 = 450
              height: 'auto',
              minHeight: { xs: '80px', sm: '90px', md: '100px' },
              alignItems: 'center',
              overflow: 'visible',
              marginBottom: { xs: '20px', sm: '-75px', md: '-80px' }, // 移动端添加正向边距
              marginTop: { xs: 0, sm: 0, md: 0 },
              zIndex: 1,
              cursor: 'pointer', // 添加指针样式表明可点击
              transition: 'transform 0.2s', // 添加过渡效果
              '&:hover': {
                transform: { 
                  xs: 'scale(1.05)', 
                  sm: 'translateY(-90%) scale(1.05)', 
                  md: 'translateY(-90%) scale(1.05)'
                }, // 悬停时略微放大，移动端不需要Y轴平移
              },
              '&:active': {
                transform: { 
                  xs: 'scale(0.95)', 
                  sm: 'translateY(-90%) scale(0.95)', 
                  md: 'translateY(-90%) scale(0.95)'
                }, // 点击时略微缩小，移动端不需要Y轴平移
              },
              userSelect: 'none', // 防止文本被选中
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              WebkitTapHighlightColor: 'transparent', // 移除移动设备点击高亮
              outline: 'none', // 移除点击轮廓
            }}
            onMouseDown={handleLogoMouseDown}
            onMouseUp={handleLogoMouseUp}
            onMouseLeave={handleLogoMouseLeave}
            onTouchStart={handleLogoMouseDown}
            onTouchEnd={handleLogoMouseUp}
            onTouchCancel={handleLogoMouseLeave}
          >
            {/* 透明蒙版，接收所有点击事件 */}
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
              }}
            />
            
            {/* 彩虹划过动画 */}
            {showAnimation && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 5,
                  background: `linear-gradient(
                    to bottom,
                    #FF0000 0%,
                    #FF0000 14.28%,
                    #FF7F00 14.28%, 
                    #FF7F00 28.57%,
                    #FFFF00 28.57%,
                    #FFFF00 42.85%,
                    #00FF00 42.85%,
                    #00FF00 57.14%,
                    #00FFFF 57.14%,
                    #00FFFF 71.42%,
                    #0000FF 71.42%,
                    #0000FF 85.71%,
                    #8B00FF 85.71%,
                    #8B00FF 100%
                  )`,
                  animation: `${animationDirection === 'forward' ? 'rainbow-sweep-right' : 'rainbow-sweep-left'} 1s ease-out forwards`,
                  opacity: 0
                }}
              />
            )}
            
            <Typography component="span" sx={{ color: rainbowColors[logoColorIndices[0]], lineHeight: 0.8, fontSize: 'inherit', transition: 'color 0.3s' }}>M</Typography>
            <Typography component="span" sx={{ color: rainbowColors[logoColorIndices[1]], lineHeight: 0.8, fontSize: 'inherit', transition: 'color 0.3s' }}>v</Typography>
            <Typography component="span" sx={{ color: rainbowColors[logoColorIndices[2]], lineHeight: 0.8, fontSize: 'inherit', transition: 'color 0.3s' }}>i</Typography>
            <Typography component="span" sx={{ color: rainbowColors[logoColorIndices[3]], lineHeight: 0.8, fontSize: 'inherit', transition: 'color 0.3s' }}>a</Typography>
            <Typography component="span" sx={{ color: rainbowColors[logoColorIndices[4]], lineHeight: 0.8, fontSize: 'inherit', transition: 'color 0.3s' }}>n</Typography>
            <Typography component="span" sx={{ color: rainbowColors[logoColorIndices[5]], lineHeight: 0.8, fontSize: 'inherit', transition: 'color 0.3s' }}>a</Typography>
            <Typography component="span" sx={{ color: rainbowColors[logoColorIndices[6]], lineHeight: 0.8, fontSize: 'inherit', transition: 'color 0.3s' }}>v</Typography>
          </Box>
          
          {/* 真正的搜索框表单 */}
          <Box component="form" onSubmit={handleSearch} sx={{ 
            width: '100%', 
            maxWidth: 600,
            position: 'relative', 
            zIndex: 2,
            px: { xs: 3, sm: 2, md: 0 }, // 移动端添加左右内边距
          }}>
            <Paper 
              ref={searchRef} 
              elevation={3}
              sx={{ 
                borderRadius: 28,
                backgroundColor: actualDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                // 根据是否开启每日一图来决定是否显示荧光效果，未聚焦时荧光更强，深色模式下进一步增强
                boxShadow: useBingWallpaper 
                  ? 'none' 
                  : actualDarkMode 
                    ? `0 0 18px 6px ${mColor}80, 0 0 30px 10px ${mColor}50` // 深色模式下荧光更强
                    : `0 0 15px 5px ${mColor}70, 0 0 25px 8px ${mColor}40`, // 浅色模式下荧光适中
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                width: { xs: '100%', sm: '90%', md: '100%' }, // 在sm尺寸下减小宽度
                mx: 'auto', // 水平居中
                '&:hover': {
                  // 悬停时荧光效果适中
                  boxShadow: useBingWallpaper 
                    ? 'none' 
                    : actualDarkMode
                      ? `0 0 14px 4px ${mColor}70, 0 0 22px 7px ${mColor}40` // 深色模式下
                      : `0 0 12px 4px ${mColor}60, 0 0 20px 6px ${mColor}30` // 浅色模式下
                },
                '&:focus-within': {
                  // 聚焦时荧光效果最弱
                  boxShadow: useBingWallpaper 
                    ? 'none' 
                    : actualDarkMode
                      ? `0 0 10px 3px ${mColor}60, 0 0 18px 5px ${mColor}30` // 深色模式下
                      : `0 0 8px 2px ${mColor}50, 0 0 15px 4px ${mColor}20`  // 浅色模式下
                }
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
                    // 确保输入框边框在任何状态下都是透明的
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                      transition: 'border-color 0.3s ease-in-out'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                      borderWidth: '1px'
                    },
                    color: actualDarkMode ? 'white' : 'black',
                    '& input::placeholder': {
                      color: actualDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                      opacity: 1
                    },
                    '& .MuiSvgIcon-root': {
                      color: actualDarkMode ? 'white' : 'rgba(0, 0, 0, 0.54)',
                    },
                    // 确保在焦点状态下没有额外的边框或阴影
                    '&.Mui-focused': {
                      outline: 'none'
                    }
                  }
                }}
              />
            </Paper>
          </Box>
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