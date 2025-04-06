import { LitElement, html, css } from 'lit';
import '@material/web/textfield/outlined-text-field';
import '@material/web/tabs/primary-tab.js';
import '@material/web/tabs/tabs.js';
import '@material/web/button/text-button.js';
import '@material/web/ripple/ripple.js';
import '@material/web/icon/icon.js';
import { argbFromHex, themeFromSourceColor } from '@material/material-color-utilities';

export class SearchApp extends LitElement {
  static properties = {
    isFocused: { type: Boolean, reflect: true },
    searchText: { type: String },
    searchEngines: { type: Array },
    categories: { type: Array },
    selectedCategory: { type: String, reflect: true },
    selectedEngine: { type: Object },
    isLoading: { type: Boolean, reflect: true },
    hasText: { type: Boolean, reflect: true },
    engineSelected: { type: Boolean },
    categorySelected: { type: Boolean },
    loadError: { type: Boolean },
    isCardInteracting: { type: Boolean }
  };

  constructor() {
    super();
    this.isFocused = false;
    this.searchText = '';
    this.hasText = false;
    this.searchEngines = [];
    this.categories = [];
    this.selectedCategory = 'common'; // 默认选择"常用"分类
    this.selectedEngine = null;
    this.isLoading = true;
    this.engineSelected = false;
    this.categorySelected = false;
    this.loadError = false;
    this.isCardInteracting = false;
    this._loadSearchEngines();
  }

  async _loadSearchEngines() {
    try {
      this.isLoading = true;
      // 尝试多种可能的路径
      let response;
      const possiblePaths = [
        './search-engines.json',
        '/search-engines.json',
        'search-engines.json',
        './assets/search-engines.json',
        '/assets/search-engines.json',
        'assets/search-engines.json',
        './src/search-engines.json',
        '/src/search-engines.json',
        'src/search-engines.json',
        '../src/search-engines.json'
      ];
      
      let loadError = null;
      for (const path of possiblePaths) {
        try {
          console.log(`尝试加载路径: ${path}`);
          response = await fetch(path);
          if (response.ok) {
            console.log(`成功从路径加载: ${path}`);
            loadError = null;
            break;
          }
        } catch (e) {
          loadError = e;
          console.log(`尝试路径 ${path} 失败:`, e.message);
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(loadError ? loadError.message : '无法加载搜索引擎配置文件');
      }
      
      const data = await response.json();
      this.categories = data.categories;
      this.searchEngines = data.engines;
      
      // 设置默认选中的搜索引擎为第一个常用搜索引擎
      const defaultEngine = this.searchEngines.find(engine => 
        engine.categories.includes(this.selectedCategory));
      this.selectedEngine = defaultEngine || this.searchEngines[0];
      this.isLoading = false;
      this.loadError = false;
      
      // 引擎加载完成后，更新搜索框的提示文字
      this.updateAfterNextRender(() => {
        const searchField = this.shadowRoot.querySelector('md-outlined-text-field');
        if (searchField) {
          searchField.placeholder = this._getSearchPlaceholder();
        }
      });
    } catch (error) {
      console.error('加载搜索引擎配置失败:', error);
      this.isLoading = false;
      this.loadError = true;
      
      // 回退方案：如果无法加载配置，创建一些默认数据
      this._createFallbackData();
      
      // 引擎加载完成后，更新搜索框的提示文字
      this.updateAfterNextRender(() => {
        const searchField = this.shadowRoot.querySelector('md-outlined-text-field');
        if (searchField) {
          searchField.placeholder = this._getSearchPlaceholder();
        }
      });
      
      // 3秒后自动尝试再次加载
      setTimeout(() => {
        if (this.loadError) {
          this._loadSearchEngines();
        }
      }, 3000);
    }
  }
  
  _createFallbackData() {
    this.categories = [
      { id: 'common', name: '常用', description: '常用搜索引擎' },
      { id: 'video', name: '视频', description: '视频搜索引擎' }
    ];
    
    this.searchEngines = [
      { 
        id: 'google', 
        name: 'Google', 
        url: 'https://www.google.com/search?q={query}',
        categories: ['common']
      },
      { 
        id: 'bing', 
        name: 'Bing', 
        url: 'https://www.bing.com/search?q={query}',
        categories: ['common']
      }
    ];
    
    this.selectedEngine = this.searchEngines[0];
  }

  firstUpdated() {
    // 获取搜索框元素并直接设置样式
    const searchField = this.shadowRoot.querySelector('md-outlined-text-field');
    if (searchField) {
      // 尝试找到输入框元素并应用居中样式
      setTimeout(() => {
        const input = searchField.shadowRoot?.querySelector('input');
        if (input) {
          input.style.textAlign = 'center';
        }
      }, 100);
    }
    
    // 设置全局点击事件处理，用于检测点击卡片外部
    document.addEventListener('click', (e) => {
      // 当已经显示卡片时才进行处理
      if (this.isFocused || this.hasText) {
        const cardElement = this.shadowRoot.querySelector('.engine-card');
        const searchFieldElement = this.shadowRoot.querySelector('md-outlined-text-field');
        
        // 检查点击是否在卡片或搜索框之外
        if (cardElement && searchFieldElement) {
          const clickInCard = e.composedPath().includes(cardElement);
          const clickInSearchField = e.composedPath().includes(searchFieldElement);
          
          // 如果点击在卡片和搜索框之外，并且没有文本，则隐藏卡片
          if (!clickInCard && !clickInSearchField && !this.isCardInteracting && !this.hasText) {
            this.isFocused = false;
          }
        }
      }
    });
    
    // 添加卡片交互监听
    const cardElement = this.shadowRoot.querySelector('.engine-card');
    if (cardElement) {
      cardElement.addEventListener('mouseenter', () => {
        this.isCardInteracting = true;
      });
      
      cardElement.addEventListener('mouseleave', () => {
        // 鼠标离开时，延迟一段时间再设置为非交互状态
        setTimeout(() => {
          this.isCardInteracting = false;
        }, 300);
      });
      
      // 针对移动设备的触摸事件
      cardElement.addEventListener('touchstart', () => {
        this.isCardInteracting = true;
      }, { passive: true });
    }
  }

  _handleFocus() {
    this.isFocused = true;
  }
  
  _handleBlur(e) {
    // 延迟处理失焦事件，确保点击卡片内元素不会导致卡片隐藏
    setTimeout(() => {
      // 如果正在与卡片交互、刚刚选择了引擎或切换了分类，则不隐藏卡片
      if (this.isCardInteracting || this.engineSelected || this.categorySelected) {
        this.engineSelected = false;
        this.categorySelected = false;
        return;
      }
      
      // 检查当前活动元素是否是卡片内的元素
      const activeElement = this.shadowRoot.activeElement;
      const cardElement = this.shadowRoot.querySelector('.engine-card');
      
      if (activeElement && cardElement && cardElement.contains(activeElement)) {
        // 如果活动元素在卡片内，不隐藏卡片
        return;
      }
      
      this.isFocused = false;
    }, 100); // 增加延迟时间，给用户更多的操作时间
  }

  _handleInput(e) {
    this.searchText = e.target.value;
    this.hasText = this.searchText && this.searchText.length > 0;
    if (this.hasText) {
      this.setAttribute('hasText', '');
    } else {
      this.removeAttribute('hasText');
    }
  }

  _handleSearch(e) {
    if (e.key === 'Enter' && this.searchText && this.selectedEngine) {
      const searchUrl = this.selectedEngine.url.replace('{query}', encodeURIComponent(this.searchText));
      window.open(searchUrl, '_blank');
    }
  }

  // 在下一次渲染完成后执行回调
  updateAfterNextRender(callback) {
    this.requestUpdate();
    setTimeout(() => {
      callback();
    }, 10);
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      --primary-color: #1a73e8;
      --hover-color: #e8f0fe;
      --surface-color: #ffffff;
      --border-color: #e0e0e0;
      --animation-duration: 0.3s;
    }

    .search-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin: 0 auto;
      padding: 0;
      position: relative;
    }

    .search-field-container {
      width: 100%;
      display: flex;
      position: relative;
      z-index: 2;
      margin-bottom: 16px;
    }

    md-outlined-text-field {
      width: 100%;
      --md-outlined-text-field-container-shape: 24px;
      --md-outlined-text-field-container-height: 44px;
      --md-outlined-text-field-input-text-align: center;
      --md-outlined-text-field-input-text-font: 16px 'Arial', sans-serif;
      --md-outlined-text-field-input-text-weight: 400;
      --md-outlined-text-field-input-text-placeholder-color: rgba(0, 0, 0, 0.4);
      min-width: 300px;
    }

    /* 添加自定义样式以确保文本居中和提示文字透明度 */
    md-outlined-text-field::part(input) {
      text-align: center;
    }

    /* 针对不同浏览器的placeholder透明度调整 */
    md-outlined-text-field::part(input)::placeholder {
      opacity: 0.6;
      color: rgba(0, 0, 0, 0.4);
    }

    /* Firefox特定的placeholder样式 */
    md-outlined-text-field::part(input)::-moz-placeholder {
      opacity: 0.6;
      color: rgba(0, 0, 0, 0.4);
    }

    /* WebKit浏览器的placeholder样式 */
    md-outlined-text-field::part(input)::-webkit-input-placeholder {
      opacity: 0.6;
      color: rgba(0, 0, 0, 0.4);
    }

    /* Edge的placeholder样式 */
    md-outlined-text-field::part(input)::-ms-input-placeholder {
      opacity: 0.6;
      color: rgba(0, 0, 0, 0.4);
    }

    /* 引擎卡片样式 - 使用动画代替display属性 */
    .engine-card {
      display: flex;
      flex-direction: column;
      width: 100%;
      background-color: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      margin-bottom: 8px;
      
      /* 动画属性 */
      max-height: 0;
      opacity: 0;
      transform: translateY(-10px);
      transition: max-height var(--animation-duration) ease, 
                  opacity var(--animation-duration) ease,
                  transform var(--animation-duration) ease,
                  padding-bottom var(--animation-duration) ease;
      pointer-events: none;
      padding-bottom: 0;
    }
    
    /* 聚焦或有文本时显示卡片 */
    :host([isFocused]) .engine-card,
    :host([hasText]) .engine-card {
      max-height: min(600px, 80vh); /* 使用视口高度的百分比，确保在小屏幕上不会过大 */
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      padding-bottom: 8px;
    }

    /* 搜索引擎显示区域的动画 */
    .engine-display {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-color);
      background-color: white;
      position: relative;
      overflow: hidden;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      margin-bottom: 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      
      /* 动画效果 */
      opacity: 0;
      transform: translateY(-5px);
      transition: opacity calc(var(--animation-duration) * 0.8) ease,
                  transform calc(var(--animation-duration) * 0.8) ease;
      transition-delay: calc(var(--animation-duration) * 0.1);
    }
    
    /* 显示时的动画状态 */
    :host([isFocused]) .engine-display,
    :host([hasText]) .engine-display {
      opacity: 1;
      transform: translateY(0);
    }

    .engine-display-text {
      display: flex;
      align-items: center;
      transition: transform var(--animation-duration) ease;
    }
    
    /* 使内容区域的动画略微延迟，营造级联动画效果 */
    :host([isFocused]) .unified-content,
    :host([hasText]) .unified-content {
      opacity: 1;
      transform: scaleY(1);
      transition-delay: calc(var(--animation-duration) * 0.15);
    }

    .engine-display-icon {
      margin-right: 8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .category-selector {
      width: 100%;
      margin-top: 4px;
      margin-bottom: 4px;
      transition: transform var(--animation-duration) ease, opacity var(--animation-duration) ease;
    }
    
    md-tabs {
      --md-primary-tab-container-color: transparent;
      --md-primary-tab-label-text-color: #666;
      --md-primary-tab-active-indicator-color: var(--primary-color);
      --md-primary-tab-active-label-text-color: var(--primary-color);
      --md-primary-tab-container-height: 48px;
      --md-primary-tab-container-shape: 24px;
    }

    /* 统一内容区域动画效果 */
    .unified-content {
      padding: 0 12px;
      transition: transform var(--animation-duration) ease,
                  opacity var(--animation-duration) ease;
      transform-origin: top;
      opacity: 0;
      transform: scaleY(0.9);
    }

    .engines-display {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 10px;
      overflow-y: auto;
      padding: 4px 0;
      width: 100%;
      transition: opacity var(--animation-duration) ease;
    }
    
    /* 移动设备适配 */
    @media (max-width: 480px) {
      .engines-display {
        grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
        gap: 8px;
      }
      
      .engine-item {
        height: 70px;
        padding: 8px 6px;
      }
      
      .engine-icon {
        width: 28px;
        height: 28px;
        margin-bottom: 6px;
      }
      
      .engine-name {
        font-size: 12px;
      }
    }
    
    .engine-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 76px;
      background-color: #f8f8f8;
      border-radius: 12px;
      padding: 10px 8px;
      cursor: pointer;
      transition: all var(--animation-duration) ease;
      border: 2px solid transparent;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      position: relative;
      overflow: hidden;
    }

    .engine-item:hover {
      background-color: var(--hover-color);
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
    }
    
    .engine-item:active {
      transform: translateY(0);
      background-color: #e8e8e8;
    }

    .engine-item.selected {
      border-color: var(--primary-color);
      background-color: var(--hover-color);
    }

    .engine-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      border-radius: 50%;
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-color);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: transform var(--animation-duration) ease;
    }

    .engine-name {
      font-size: 14px;
      text-align: center;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color var(--animation-duration) ease;
    }

    .scroll-container {
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #ccc transparent;
      padding: 0 4px;
      max-height: min(300px, 60vh); /* 使用视口高度的百分比 */
      margin-top: 4px;
      padding-bottom: 8px;
      transition: opacity var(--animation-duration) ease;
    }

    .scroll-container::-webkit-scrollbar {
      width: 4px;
    }

    .scroll-container::-webkit-scrollbar-track {
      background: transparent;
    }

    .scroll-container::-webkit-scrollbar-thumb {
      background-color: #ccc;
      border-radius: 4px;
    }

    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
    }

    .loading-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: var(--primary-color);
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  updated(changedProperties) {
    // 当状态变化时触发更新
    if (changedProperties.has('searchText') || 
        changedProperties.has('isFocused') ||
        changedProperties.has('selectedCategory')) {
      
      if (changedProperties.has('isFocused')) {
        if (this.isFocused) {
          this.setAttribute('isFocused', '');
        } else {
          this.removeAttribute('isFocused');
        }
      }
      
      if (changedProperties.has('searchText')) {
        this.hasText = this.searchText && this.searchText.length > 0;
        if (this.hasText) {
          this.setAttribute('hasText', '');
        } else {
          this.removeAttribute('hasText');
        }
      }
      
      this.requestUpdate();
    }
  }

  _handleCategorySelect(categoryId) {
    // 防止重复点击同一分类
    if (this.selectedCategory === categoryId) {
      return;
    }

    this.categorySelected = true;
    this.isCardInteracting = true; // 标记正在与卡片交互
    this.selectedCategory = categoryId;
    
    // 标记是否引擎已变更
    let engineChanged = false;
    
    // 如果当前选中的搜索引擎不在新选中的分类中，则重新选择一个
    const currentEngineInCategory = this.selectedEngine && 
                                  (categoryId === 'all' || 
                                   this.selectedEngine.categories.includes(categoryId));
                                   
    if (!currentEngineInCategory) {
      // 找到新分类中的第一个搜索引擎
      const newEngine = this.searchEngines.find(engine => 
        categoryId === 'all' || engine.categories.includes(categoryId));
      this.selectedEngine = newEngine || null;
      engineChanged = true;
    }
    
    // 请求更新，确保UI正确显示筛选后的引擎列表
    this.requestUpdate();
    
    // 如果引擎变更了，需要更新搜索框的提示文字
    if (engineChanged) {
      const searchField = this.shadowRoot.querySelector('md-outlined-text-field');
      if (searchField) {
        searchField.placeholder = this._getSearchPlaceholder();
      }
    }
    
    // 在更短的延迟后重新聚焦搜索框，确保分类切换后不会失去焦点
    clearTimeout(this._focusTimeout); // 清除之前可能存在的定时器
    this._focusTimeout = setTimeout(() => {
      const searchField = this.shadowRoot.querySelector('md-outlined-text-field');
      if (searchField) {
        searchField.focus();
      }
      
      // 保持卡片交互状态一段时间，以便用户可以继续操作
      setTimeout(() => {
        this.isCardInteracting = false;
      }, 800);
    }, 5);
  }

  _handleEngineSelect(engine) {
    this.engineSelected = true;
    this.isCardInteracting = true; // 标记正在与卡片交互
    this.selectedEngine = engine;
    
    // 不再自动执行搜索，只有用户按回车时才执行搜索
    // 让用户有机会看到自己选择的引擎和修改查询文本
    
    this.requestUpdate();
    
    // 更新搜索框中的占位符文本
    const searchField = this.shadowRoot.querySelector('md-outlined-text-field');
    if (searchField) {
      searchField.placeholder = this._getSearchPlaceholder();
    }
    
    // 清除之前可能存在的定时器
    clearTimeout(this._focusTimeout);
    this._focusTimeout = setTimeout(() => {
      if (searchField) {
        searchField.focus();
      }
      
      // 保持卡片交互状态一段时间，以便用户可以继续操作
      setTimeout(() => {
        this.isCardInteracting = false;
      }, 800);
    }, 5);
  }

  _getFilteredEngines() {
    if (this.selectedCategory === 'all') {
      return this.searchEngines;
    }
    return this.searchEngines.filter(engine => 
      engine.categories.includes(this.selectedCategory));
  }

  _getEngineInitial(name) {
    // 获取搜索引擎名称的首字母或汉字第一个字
    return name.charAt(0);
  }

  // 生成搜索提示文字
  _getSearchPlaceholder() {
    if (!this.selectedEngine) {
      return "搜索...";
    }
    
    const engineName = this.selectedEngine.name;
    return `${engineName}一下，你就知道${engineName}知道得很多......`;
  }

  render() {
    const filteredEngines = this._getFilteredEngines();
    
    return html`
      <div class="search-container">
        <div class="search-field-container">
          <md-outlined-text-field
            placeholder="${this._getSearchPlaceholder()}"
            type="search"
            style="text-align: center;"
            class="centered-text"
            @focus="${this._handleFocus}"
            @blur="${this._handleBlur}"
            @input="${this._handleInput}"
            @keydown="${this._handleSearch}"
            .value="${this.searchText}"
          ></md-outlined-text-field>
        </div>
        
        <!-- 引擎卡片：包含搜索引擎信息和分类选择器 -->
        <div class="engine-card" 
          @mousedown="${() => { this.isCardInteracting = true; }}"
          @touchstart="${() => { this.isCardInteracting = true; }}"
        >
          <!-- 搜索引擎显示区域 -->
          <div class="engine-display">
            <div class="engine-display-text">
              <div class="engine-display-icon">${this.selectedEngine ? this._getEngineInitial(this.selectedEngine.name) : '?'}</div>
              ${this.selectedEngine ? this.selectedEngine.name : '选择搜索引擎'}
            </div>
          </div>
          
          <!-- 统一内容区域：包含分类选择器和引擎显示板 -->
          <div class="unified-content">
            <!-- 分类选择器，总是显示 -->
            <div class="category-selector">
              <md-tabs>
                ${this.categories.map(category => html`
                  <md-primary-tab 
                    ?active="${this.selectedCategory === category.id}"
                    @click="${() => this._handleCategorySelect(category.id)}"
                  >
                    ${category.name}
                  </md-primary-tab>
                `)}
              </md-tabs>
            </div>
            
            <!-- 搜索引擎显示板，总是显示 -->
            <div class="scroll-container">
              ${this.isLoading ? 
                html`<div class="loading"><div class="loading-spinner"></div></div>` :
                html`
                  <div class="engines-display">
                    ${filteredEngines.map(engine => html`
                      <div 
                        class="engine-item ${this.selectedEngine && this.selectedEngine.id === engine.id ? 'selected' : ''}"
                        @click="${() => this._handleEngineSelect(engine)}"
                        @mousedown="${() => { this.isCardInteracting = true; }}"
                        @touchstart="${() => { this.isCardInteracting = true; }}"
                      >
                        <md-ripple></md-ripple>
                        <div class="engine-icon">${this._getEngineInitial(engine.name)}</div>
                        <div class="engine-name">${engine.name}</div>
                      </div>
                    `)}
                  </div>
                `
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('search-app', SearchApp); 