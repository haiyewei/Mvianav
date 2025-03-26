import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  Divider,
  Link,
  Pagination
} from '@mui/material';

const SearchResults = ({ searchTerm }) => {
  // 模拟搜索结果数据
  const mockResults = [
    {
      id: 1,
      title: "Google搜索引擎 - 维基百科",
      link: "https://zh.wikipedia.org/wiki/Google搜索",
      description: "Google搜索是Google公司的主要产品，是目前全球最大的搜索引擎。Google在1997年由拉里·佩奇和谢尔盖·布林创建，最初只是一个搜索引擎，随后逐渐扩展业务..."
    },
    {
      id: 2,
      title: "Google搜索技巧: 如何更有效地使用Google",
      link: "https://example.com/google-search-tips",
      description: "掌握这些Google搜索技巧，让您的搜索更加精准。学习如何使用引号、减号、站内搜索等高级功能，节省时间找到更精确的结果。"
    },
    {
      id: 3,
      title: "Google搜索算法是如何工作的 - 技术解析",
      link: "https://example.com/how-google-works",
      description: "深入了解Google的排名机制，PageRank算法如何确定网页的相关性和重要性。本文解析Google如何处理每日数十亿次搜索请求。"
    },
    {
      id: 4,
      title: `关于"${searchTerm}"的最新研究报告 - 2023`,
      link: "https://example.com/latest-research",
      description: `查看2023年关于${searchTerm}的最新研究发现和行业动态。包含市场分析、技术趋势和未来发展预测。`
    },
    {
      id: 5,
      title: `${searchTerm} - 官方网站`,
      link: `https://${searchTerm.toLowerCase().replace(/\s+/g, '')}.com`,
      description: `${searchTerm}的官方网站，提供最权威的信息、服务和产品。立即访问了解更多详情。`
    }
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 3, px: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        找到约 2,150,000,000 条结果 (0.58 秒)
      </Typography>
      
      <List sx={{ mb: 4 }}>
        {mockResults.map((result) => (
          <React.Fragment key={result.id}>
            <ListItem alignItems="flex-start" sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography component="div" variant="body2" color="text.secondary">
                {result.link}
              </Typography>
              <Link href={result.link} underline="hover" variant="h6" color="primary" sx={{ mb: 0.5 }}>
                {result.title}
              </Link>
              <Typography variant="body2" color="text.secondary">
                {result.description}
              </Typography>
            </ListItem>
            <Divider component="li" sx={{ my: 2 }} />
          </React.Fragment>
        ))}
      </List>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 6 }}>
        <Pagination count={10} color="primary" />
      </Box>
    </Box>
  );
};

export default SearchResults; 