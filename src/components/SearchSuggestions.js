import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const SearchSuggestions = ({ query, onSelectSuggestion, selectedSearchEngine }) => {
  // 模拟基于查询的搜索建议
  const generateSuggestions = (searchQuery, searchEngine) => {
    if (!searchQuery || searchQuery.trim() === '') return [];
    
    const baseQuery = searchQuery.toLowerCase().trim();
    
    // 根据不同的搜索引擎提供不同风格的建议
    switch(searchEngine?.id) {
      case 'google':
        return [
          { text: `${baseQuery}`, type: 'search' },
          { text: `${baseQuery} 教程`, type: 'search' },
          { text: `${baseQuery} reddit`, type: 'search' },
          { text: `${baseQuery} site:github.com`, type: 'search' },
          { text: `${baseQuery} filetype:pdf`, type: 'search' },
          { text: `how to ${baseQuery}`, type: 'trending' },
        ].filter(item => item.text.trim() !== '');
        
      case 'bing':
        return [
          { text: `${baseQuery}`, type: 'search' },
          { text: `${baseQuery} 教程`, type: 'search' },
          { text: `${baseQuery} 知识`, type: 'search' },
          { text: `${baseQuery} 图片`, type: 'search' },
          { text: `${baseQuery} 视频`, type: 'search' },
          { text: `${baseQuery} 热门话题`, type: 'trending' },
        ].filter(item => item.text.trim() !== '');
        
      case 'baidu':
        return [
          { text: `${baseQuery}`, type: 'search' },
          { text: `${baseQuery}是什么`, type: 'search' },
          { text: `${baseQuery}怎么样`, type: 'search' },
          { text: `${baseQuery}百科`, type: 'search' },
          { text: `${baseQuery}官网`, type: 'search' },
          { text: `${baseQuery}最新消息`, type: 'trending' },
        ].filter(item => item.text.trim() !== '');
        
      case 'sogou':
        return [
          { text: `${baseQuery}`, type: 'search' },
          { text: `${baseQuery} 微信`, type: 'search' },
          { text: `${baseQuery} 知乎`, type: 'search' },
          { text: `${baseQuery} 下载`, type: 'search' },
          { text: `${baseQuery} 教程`, type: 'search' },
          { text: `${baseQuery} 相关信息`, type: 'trending' },
        ].filter(item => item.text.trim() !== '');
        
      default:
        // 默认建议
        return [
          { text: `${baseQuery}`, type: 'search' },
          { text: `${baseQuery} 教程`, type: 'search' },
          { text: `${baseQuery} 最新动态`, type: 'search' },
          { text: `${baseQuery} 怎么用`, type: 'search' },
          { text: `${baseQuery} vs 其他产品`, type: 'search' },
          { text: `为什么${baseQuery}这么受欢迎`, type: 'trending' },
        ].filter(item => item.text.trim() !== '');
    }
  };
  
  const suggestions = generateSuggestions(query, selectedSearchEngine);
  
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'absolute', 
        width: '100%', 
        mt: 0.5, 
        borderRadius: 2, 
        zIndex: 10,
        overflow: 'hidden'
      }}
    >
      <List sx={{ py: 0 }}>
        {suggestions.map((suggestion, index) => (
          <ListItem 
            key={index}
            button
            onClick={() => onSelectSuggestion(suggestion.text)}
            sx={{ 
              py: 1, 
              '&:hover': { 
                backgroundColor: '#f5f5f5' 
              } 
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {suggestion.type === 'trending' ? (
                <TrendingUpIcon fontSize="small" />
              ) : (
                <SearchIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText primary={suggestion.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default SearchSuggestions; 